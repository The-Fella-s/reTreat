// Function that removes the stacktrace from the error
function extractErrorMessage(error) {
    if (error.response && error.response.data) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(error.response.data, 'text/html');
            const preTag = doc.querySelector('pre');
            if (preTag) {
                let msg = preTag.textContent.trim();

                // Remove the stack trace: remove everything starting with a colon followed by optional spaces and "at"
                msg = msg.replace(/:\s*at[\s\S]*/, '');
                return msg;
            }
        } catch (parseError) {
            console.error('Error parsing error HTML:', parseError);
        }
        return error.response.data;
    }
    return error.message;
}

export default extractErrorMessage;
