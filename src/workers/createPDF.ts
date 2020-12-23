import createPDF from "../lib/createPDF";

self.addEventListener("message", async e => {
    const data = {
        lobsterFontBytes: () => fetch("/fonts/Lobster-Regular.ttf").then(res => res.arrayBuffer()),
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
    
    self.postMessage(pdf);
});