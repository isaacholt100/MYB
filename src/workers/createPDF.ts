import createPDF from "../lib/createPDF";

addEventListener("message", async e => {
    const data = {
        displayFontBytes: () => fetch("https://fonts.gstatic.com/s/fugazone/v10/rax_HiWKp9EAITukFsl8AxhfsUjQ8Q.woff2").then(res => res.arrayBuffer()),
        standardFontBytes: () => fetch("https://fonts.gstatic.com/s/merriweather/v22/u-4m0qyriQwlOrhSvowK_l5-eRZOf-LVrPHp.woff2").then(res => res.arrayBuffer()),
        groupImage: () => fetch(e.data.groupImage).then(res => res.arrayBuffer()),
        coverImage: async () => e.data.coverImage,
    };
    
    const pdf = await createPDF(data, {
        groupColour: e.data.groupColour,
        groupName: e.data.groupName,
        members: e.data.members,
        coverPng: e.data.coverPng,
        groupPng: e.data.groupImage.slice(-4) === ".png",
        prizes: e.data.prizes,
    });
    
    postMessage(pdf);
});