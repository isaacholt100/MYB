import { clipEvenOdd, drawEllipsePath, endPath, PDFDocument, PDFFont, PDFImage, PDFPage, popGraphicsState, pushGraphicsState, RGB, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { IMember } from "../types/member";
import { IPoll, IPrize } from "../hooks/usePrizes";
import prizeIcons from "./prizeIcons";
import { mdiTrophy } from "@mdi/js";
import { groupBy, sortBy } from "lodash";

interface IPdfData {
    displayFontBytes(): Promise<Bytes>;
    standardFontBytes(): Promise<Bytes>;
    coverImage(): Promise<Bytes>;
    groupImage(): Promise<Bytes>;
}

interface IInfo {
    groupName: string;
    groupColour: [number, number, number];
    members: IMember[];
    coverPng: boolean;
    groupPng: boolean;
    prizes: IPrize[];
}

const titleSize = 40, subtitleSize = 32;
const chunkSize = 6;
const picSize = 64;

export default async function createPDF(data: IPdfData, info: IInfo) {
    try {
        const doc = await PDFDocument.create();
        doc.registerFontkit(fontkit);
        const coverBytes = await data.coverImage(), displayFontBytes = await data.displayFontBytes(), groupBytes = await data.groupImage();
        const displayFont = await doc.embedFont(displayFontBytes);
        const standardFont = await doc.embedFont(await data.standardFontBytes());
        const coverImage = await doc[info.coverPng ? "embedPng" : "embedJpg"](coverBytes);
        const groupImage = await doc[info.groupPng ? "embedPng" : "embedJpg"](groupBytes);
        
        const members: Member[] = [];
        for (const member of info.members) {
            const picBytes = await fetch(member.pic !== "" ? member.pic : "/images/default_user.png").then(res => res.arrayBuffer());
            members.push({
                ...member,
                picBytes,
            }); 
        }/*
        async.each(info.members, async (member: IMember) => {
            const picBytes = await fetch(member.pic || "/images/default_user.png").then(res => res.arrayBuffer());
            members.push({
                ...member,
                picBytes,
            });
        }, (err) => {
            throw err;
        });*/
        return new Yearbook(doc, coverImage, groupImage, displayFont, standardFont, info.groupName, info.groupColour, members, info.prizes).create();
    } catch (err) {
        console.error(err);
        return null;
    }
}

type Member = IMember & { picBytes: ArrayBuffer };

type Bytes = ArrayBuffer | Uint8Array;

const getTopThree = (polls: IPoll[]) => {
    if (!polls || polls.length === 0) {
        return [];
    }
    const list = [].concat(...polls.map(p => p.votes)) as string[];
    const groups = groupBy(list);
    const sorted = sortBy(groups, a => -a.length);
    return sorted.slice(0, 3).map(x => x[0]);
}

class Yearbook {
    private groupColour: RGB;
    constructor(private doc: PDFDocument, private coverImage: PDFImage, private groupImage: PDFImage, private displayFont: PDFFont, private standardFont: PDFFont, private groupName: string, groupColour: [number, number, number], private members: Member[], private prizes: IPrize[]) {
        this.doc = doc;
        this.coverImage = coverImage;
        this.groupImage = groupImage;
        this.groupName = groupName;
        this.displayFont = displayFont;
        this.standardFont = standardFont;
        this.groupColour = rgb(...groupColour);
        this.members = members;
        this.prizes = prizes;
    }
    
    private getdisplaySize(text: string, size: number, pageWidth: number): [number, number] {
        const width = this.displayFont.widthOfTextAtSize(text, size);
        const height = this.displayFont.heightAtSize(size);
        const x = (pageWidth - width) / 2;

        return [height, x];
    }
    private async drawCoverImage(page: PDFPage, pageHeight: number, pageWidth: number) {
        const pageRatio = pageHeight / pageWidth;
        const imageRatio = this.coverImage.height / this.coverImage.width;
        const [imgHeight, imgWidth] = pageRatio < imageRatio ? [imageRatio * pageWidth, pageWidth] : [pageHeight, pageHeight / imageRatio];
    
        page.drawImage(this.coverImage, {
            x: Math.min((pageWidth - imgWidth) / 2, 0),
            y: Math.min((pageHeight - imgHeight) / 2, 0),
            height: imgHeight,
            width: imgWidth,
        });
    }
    private async coverPage() {
        const year = new Date().getFullYear();
    
        const coverPage = this.doc.addPage();
        const pageHeight = coverPage.getHeight(), pageWidth = coverPage.getWidth();

        this.drawCoverImage(coverPage, pageHeight, pageWidth);
    
        const title = "Yearbook";
        const [height, x] = this.getdisplaySize(title, titleSize, pageWidth);
        let rectangleHeight = height;
    
        const leaversText = year + " Leavers";
        const [height1, x1] = this.getdisplaySize(leaversText, subtitleSize, pageWidth);
        rectangleHeight += height1;
        const y1 = rectangleHeight;
    
        const subtitle = this.groupName;
        const [height2, x2] = this.getdisplaySize(subtitle, subtitleSize, pageWidth);
        rectangleHeight += height2;
    
        coverPage.drawRectangle({
            borderColor: rgb(0, 0, 0),
            borderWidth: 4,
            width: pageWidth - 16,
            height: rectangleHeight + 40,
            x: 8,
            y: pageHeight - rectangleHeight - 48,
            color: rgb(1, 1, 1),
            opacity: 0.5,
        });
    
        coverPage.drawText(title, {
            font: this.displayFont,
            color: rgb(0, 0, 0),
            size: titleSize,
            y: pageHeight - 8 - height,
            x,
        });
        coverPage.drawText(leaversText, {
            font: this.displayFont,
            color: rgb(0, 0, 0),
            size: subtitleSize,
            y: pageHeight - y1 - 24,
            x: x1,
        });
        coverPage.drawText(subtitle, {
            font: this.displayFont,
            color: this.groupColour,
            size: subtitleSize,
            y: pageHeight - rectangleHeight - 24,
            x: x2,
        });
    }
    private async lastPage() {
        const page = this.doc.addPage();
        const pageWidth = page.getWidth(), pageHeight = page.getHeight(); 
        const text = "Happy Memories!";
        const [height, x] = this.getdisplaySize(text, titleSize, page.getWidth());
    
        this.drawCoverImage(page, pageHeight, pageWidth);

        page.drawRectangle({
            borderColor: rgb(0, 0, 0),
            borderWidth: 4,
            width: pageWidth - 16,
            height: height + 40,
            x: 8,
            y: pageHeight - height - 48,
            color: rgb(1, 1, 1),
            opacity: 0.5,
        });
    
        page.drawText(text, {
            font: this.displayFont,
            color: rgb(0, 0, 0),
            size: titleSize,
            y: pageHeight - 8 - height,
            x,
        });
    }
    private async embedImage(bytes: ArrayBuffer, src: string) {
        return await this.doc[src === "" || src.slice(-4) === ".png" ? "embedPng" : "embedJpg"](bytes);
    }
    private async titlePage(title: string) {
        const page = this.doc.addPage();
        const pageWidth = page.getWidth(), pageHeight = page.getHeight();

        const [textHeight, x] = this.getdisplaySize(title, titleSize, pageWidth);

        const imgHeight = this.groupImage.height, imgWidth = this.groupImage.width;
        const newHeight = 256;
        const newWidth = newHeight / imgHeight * imgWidth;

        page.drawImage(this.groupImage, {
            x: (pageWidth - newWidth) / 2,
            y: (pageHeight - newHeight) / 2,
            height: newHeight,
            width: newWidth,
        });

        page.drawText(title, {
            font: this.displayFont,
            x,
            y: (pageHeight) - 32 - textHeight, 
            size: titleSize,
            color: this.groupColour,
        });
    }
    private async membersTitlePage() {
        return await this.titlePage("Members");
    }
    private async membersPage(members: Member[]) {
        const page = this.doc.addPage();
        const l = members.length;
        //const padding = 16;
        const height = page.getHeight() * 2 / chunkSize - 4;//(page.getHeight()) * 2 / chunkSize - padding;
        const width = page.getWidth() / 2;
        for (let i = 0; i < l; i++) {
            this.insertMember(page, members[i], i < 3 ? 8 : 8 + width, (((5 - i) % 3) + 1) * height - picSize - 4);
        }
    }
    private async drawProfilePic(page: PDFPage, pic: PDFImage, x: number, y: number) {
        const ratio = pic.height / pic.width;
        const newHeight = ratio < 1 ? picSize : picSize * ratio, newWidth = ratio > 1 ? picSize : picSize / ratio;
        page.pushOperators(
            pushGraphicsState(),
            ...drawEllipsePath({
                x: x - (newWidth - picSize) / 2 + newWidth / 2,
                y: y + (newHeight - picSize) / 2 + newHeight / 2,
                xScale: picSize / 2,
                yScale: picSize / 2,
            }),
            clipEvenOdd(),
            endPath(),
        );
        page.drawImage(pic, {
            height: newHeight,
            width: newWidth,
            y: y + (newHeight - picSize) / 2,
            x: x - (newWidth - picSize) / 2,
        });
        page.pushOperators(popGraphicsState());
    }
    private async insertMember(page: PDFPage, member: Member, x: number, y: number) {
        const maxWidth = page.getWidth() / 2 - 16;
        const pic = await this.embedImage(member.picBytes, member.pic);
        this.drawProfilePic(page, pic, x, y);
        page.drawText(member.name, {
            font: this.displayFont,
            color: this.groupColour,
            size: 18,
            maxWidth: maxWidth - picSize - 12,
            x: x + picSize + 12,
            y: y + picSize - this.displayFont.heightAtSize(18),
        });
        member.quote && page.drawText(member.quote, {
            x,
            y: y - 32,
            size: 16,
            maxWidth,
            color: rgb(0, 0, 0),
            font: this.standardFont,
        });
    }
    private async insertPrize(page: PDFPage, prize: IPrize, x: number, y: number) {
        page.drawSvgPath(prizeIcons[prize.icon] || mdiTrophy, {
            x, y,
            borderColor: rgb(0, 0, 0),
            color: rgb(0, 0, 0),
            scale: 3,
        });
        page.drawText(prize.name, {
            font: this.displayFont,
            size: titleSize,
            x: x + 88,
            y: y - 48,
            maxWidth: page.getWidth() - 104,
            color: this.groupColour,
        });
        const topThree = getTopThree(prize.poll);
        await this.insertWinner(page, this.members.find(m => m._id === topThree[0]), 1, x, y - 80);
        await this.insertWinner(page, this.members.find(m => m._id === topThree[1]), 2, x, y - 176);
        await this.insertWinner(page, this.members.find(m => m._id === topThree[2]), 3, x, y - 270);
    }
    private async insertWinner(page: PDFPage, member: Member, pos: number, x: number, y: number) {
        const colours: [number, number, number][] = [[1, 215/255, 0], [192/255, 192/255, 192/255], [205/255, 127/255, 50/255]];
        page.drawCircle({
            x: x + 40,
            y: y - 40,
            size: 40,
            color: rgb(...colours[pos - 1]),
        });
        page.drawText(pos + "", {
            x: x + (80 - this.displayFont.widthOfTextAtSize(pos + "", titleSize)) / 2,
            y: y - 52.5,
            font: this.displayFont,
            color: rgb(0, 0, 0),
            size: titleSize,
        });
        const pic = await this.embedImage(member.picBytes, member.pic);
        this.drawProfilePic(page, pic, x + 100, y - picSize / 2 - 40);
        page.drawText(member.name, {
            font: this.displayFont,
            size: 24,
            color: rgb(0, 0, 0),
            x: x + 112 + picSize,
            y: y - 48,
        });
    }
    private async prizesTitlePage() {
        return await this.titlePage("Prizes");
    }
    private async prizesPage(prizes: IPrize[]) {
        const page = this.doc.addPage();
        this.insertPrize(page, prizes[0], 8, page.getHeight());
        prizes[1] && this.insertPrize(page, prizes[1], 8, page.getHeight() / 2);
    }
    async create() {
        this.coverPage();
        this.membersTitlePage();
        for (let i = 0, j = this.members.length; i < j; i += chunkSize) {
            this.membersPage(this.members.slice(i, i + chunkSize));
        }
        this.prizesTitlePage();
        for (let i = 0, j = this.prizes.length; i < j; i += 2) {
            this.prizesPage(this.prizes.slice(i, i + 2));
        }
        this.lastPage();

        const bytes = await this.doc.save();
        return bytes;
    }
}