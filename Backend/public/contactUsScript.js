const form = document.getElementById("gmail-form");
const submitBtn = document.getElementById("subject-submit");
const submitTxt = document.getElementById("subject-submit-text");

let submitted = false;
let isSubmitting = false;

submitBtn.addEventListener("mouseenter", (e) => {

    if (!submitted) {
        e.target.style.backgroundColor = "#578057";
        e.target.style.color = "var(--cream)";
    }

})

submitBtn.addEventListener("mouseleave", (e) => {

    if (!submitted) {
        e.target.style.backgroundColor = "var(--success)";
        e.target.style.color = "var(--cream)";
    }

});

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const data = {
        subject: formData.get("subject-header"),
        email: formData.get("subject-email"),
        message: formData.get("subject-body")
    };

    if (!(data.subject.trim().length != 0 && data.email.trim().length != 0 && data.message.trim().length != 0 && submitted == false)) {
        submitTxt.textContent = "Please fill all the information!";
        submitTxt.style.opacity = 1;
    } else {
        try {
            submitBtn.style.backgroundColor = "#535353"; 
            submitBtn.style.color = "#bdbdbd"; // A Lighter Charcoal
            submitBtn.style.borderColor = "var(--charcoal)";
            submitted = true;
            submitTxt.style.opacity = 0;
            
            const response = await fetch("/contact/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success == true) {
                submitTxt.textContent = "Email Successfuly Sent!";
                submitTxt.style.opacity = 1;
            } else {
                submitTxt.textContent = "Error: Please try again another time.";
                submitted = false;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
})