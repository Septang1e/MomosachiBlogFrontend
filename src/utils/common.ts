export function tocGenerator(markdownText : string) {
    const regex = /<h(\d+)\s+id="([^"]+)">([^<]+)<\/h\d+>/g;
    let match;
    while ((match = regex.exec(markdownText)) != null) {
        console.log(match)
        const tagName = match[1];
        const id = match[2];
        const content = match[3];
        console.log(`Tag: <h${tagName}>, ID: ${id}, Content: ${content}`);
    }
    console.log(match)
}