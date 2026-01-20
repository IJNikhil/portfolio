


const URL = "https://script.google.com/macros/s/AKfycbxvnZ9B-OYeBmwu4m1KEqp7UvC97aH-GuvR_cXQRVUllfWgHM0LJKfpM8VgQi2hQFOCrA/exec";

console.log("Testing URL:", URL);

async function testPost() {
    try {
        const response = await fetch(URL, {
            method: "POST",
            body: JSON.stringify({ action: "getData", auth: "admin123" }),
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            redirect: "follow"
        });

        const text = await response.text();
        console.log("--- RESPONSE START ---");
        console.log(text);
        console.log("--- RESPONSE END ---");

        try {
            JSON.parse(text);
            console.log("✅ Valid JSON received");
        } catch {
            console.log("❌ NOT JSON (Likely 'Service Active' error)");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testPost();
