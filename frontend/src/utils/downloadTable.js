async function downloadTable(url, requestParameters, tableName) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestParameters),
        });

        if (!res.ok) {
            throw new Error(`HTTP ERROR: ${res.status}`);
        }

        const blob = await res.blob();
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = tableName;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }

        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
    } catch (error) {
        console.error("Error downloading table:", error);
        alert("Ошибка при скачивании таблицы: " + error.message);
    }
}

export {downloadTable};
