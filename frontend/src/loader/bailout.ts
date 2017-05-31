function prepareHTML(untrusted: any) {
    return String(untrusted).replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
}

export default function bailout(message: string, error: Error) {
    console.log(message);
    console.log(error);
    document.body.innerHTML = `<span class="bailout-error">
${prepareHTML(message)}<br/>
${prepareHTML(error.stack)}
</span>`;
}