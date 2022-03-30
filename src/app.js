// getting crucial data from config.js
const ID = DATA.APIID
const KEY = DATA.APIKEY

// config for requesting data
const config = { "header": { "Accept": "application/json" } }

// countries for inputs
let countries = { "United Kingdom": "gb", "Austria": "at", "Australia": "au", "Brazil": "br", "Canada": "ca", "Germany": "de", "France": "fr", "India": "in", "Italy": "it", "Netherlands": "nl", "New Zealand": "nz", "Poland": "pl", "Russia": "ru", "Singapore": "sg", "United States": "us", "South Africa": "za" }

// selecting element
let main_body = document.querySelector("body")
let body = document.querySelector("#tempBody")
let extractedData = {}

let form = document.querySelector("#submitform")
form.addEventListener("submit", (event) => {
    // on submitting the form
    event.preventDefault();
    let jobCountry = form.elements.country.value
    let jobTitle = form.elements.jobTitle.value
    extractedData["country"] = jobCountry
    extractedData["title"] = jobTitle
    if (form.elements.salary) {
        let minSalary = form.elements.salary.value
        extractedData["minSalary"] = parseInt(minSalary)
    }
    if (form.elements.contract) {
        let contract = form.elements.contract.checked
        extractedData["contract"] = contract
    }
    if (form.elements.fullTime) {
        let fullTime = form.elements.fullTime.checked
        extractedData["fullTime"] = fullTime
    }
    if (form.elements.partTime) {
        let partTime = form.elements.partTime.checked
        extractedData["partTime"] = partTime
    }
    if (form.elements.permanent) {
        let permanent = form.elements.permanent.checked
        extractedData["permanent"] = permanent
    }
    getData()
})
let isNotEmpty = (obj) => {
    if (Object.keys(obj).length)
        return true
    return false
}
let getData = async () => {
    // gets data from the API
    try {
        let parameters = {}
        if (extractedData.minSalary) {
            parameters["salary_min"] = extractedData.minSalary
        }
        if (extractedData.contract) {
            parameters["contract"] = "1"
        }
        if (extractedData.fullTime) {
            parameters["full_time"] = "1"
        }
        if (extractedData.partTime) {
            parameters["part_time"] = "1"
        }
        if (extractedData.permanent) {
            parameters["permanent"] = "1"
        }
        if (isNotEmpty(parameters)) {
            config["params"] = parameters
        }
        let res = await axios.get(`https://api.adzuna.com/v1/api/jobs/${countries[extractedData.country]}/search/1?app_id=${ID}&app_key=${KEY}&results_per_page=15&what=${extractedData.title}`, config)
        showData(res.data.results)
    }
    catch {
        // error occured while fetching data
        clearData()
        let footer = document.querySelector("#footer")
        if (footer)
            main_body.removeChild(footer)
        let errorMessage = document.createElement("div")
        let boody = document.querySelector("#third")
        errorMessage.className = "errormsg"
        errorMessage.innerText = "Sorry!! Your request cannot be processed. Please try again"
        boody.append(errorMessage)
    }
}
// the filter button
let filterButton = document.querySelector("#filterButton")
function makeNewInput(Type, Name, Id) {
    // function creating new input field 
    let inp = document.createElement("input")
    inp.type = Type
    inp.name = Name
    inp.id = Id
    if (inp.type === "range") {
        inp.min = "0"
        inp.max = "1000000"
        inp.value = "0"
    }
    return inp
}
function makeNewLabel(InnerText, input) {
    // function creating new Label
    let lbl = document.createElement("label")
    lbl.innerText = InnerText
    lbl.setAttribute("for", input.id)
    return lbl
}
function makeFilterOption(loc, input, label) {
    // combining label and input
    loc.append(label)
    loc.append(input)
}

// on clicking the filter button
filterButton.addEventListener("click", () => {

    // if clicked once already
    if (form.children.length === 16)
        return

    let footer = document.querySelector("#footer")
    // check to see if footer exists
    if (footer)
        main_body.removeChild(footer)

    // appending data to div
    let div1 = document.createElement("div")
    let inpPart = makeNewInput("radio", "jobType", "partTime")
    let lblPart = makeNewLabel("Part-Time job", inpPart)
    makeFilterOption(div1, inpPart, lblPart)

    let inpFull = makeNewInput("radio", "jobType", "fullTime")
    let lblFull = makeNewLabel("Full-Time job", inpFull)
    makeFilterOption(div1, inpFull, lblFull)

    form.append(div1)
    let new_line = document.createElement("br")
    form.append(new_line)

    let div2 = document.createElement("div")
    let inpContract = makeNewInput("radio", "jobTime", "contract")
    let lblContract = makeNewLabel("Contract", inpContract)
    makeFilterOption(div2, inpContract, lblContract)

    let inpPerma = makeNewInput("radio", "jobTime", "permanent")
    let lblPerma = makeNewLabel("Permanent", inpPerma)
    makeFilterOption(div2, inpPerma, lblPerma)

    form.append(div2)
    form.append(new_line)

    let div3 = document.createElement("div")
    let inpSal = makeNewInput("range", "salary", "salary")
    let lblSal = makeNewLabel("Minimum Salary", inpSal)
    makeFilterOption(div3, inpSal, lblSal)
    form.append(div3)

    let div4 = document.createElement("div")
    div4.id = "salaryvalue"
    let slider = document.querySelector('input[type="range"]')
    slider.addEventListener("input", () => {
        div4.innerText = slider.value
    })
    form.append(div4)
})
function clearData() {
    // clears the data on the page
    let boody = document.querySelector("#third")
    let child = document.querySelectorAll(".JobData")
    for (let i = 0; i < child.length; i++) {
        boody.removeChild(child[i])
    }
    let error = document.querySelectorAll(".errormsg")
    for (let i = 0; i < error.length; i++) {
        boody.removeChild(error[i])
    }

}
let showData = (jobList) => {
    document.querySelector("#foorth").scrollIntoView({
        behavior: "smooth"
    })
    // displays data on the page
    clearData()
    let footer = document.querySelector("#footer")
    if (footer)
        main_body.removeChild(footer)

    // if no results appear
    if (jobList.length == 0) {
        let error = document.createElement("div")
        let boody = document.querySelector("#third")
        error.className = "errormsg"
        error.innerText = "Sorry!! Your request cannot be processed. Please try again"
        boody.append(error)
        form.reset()
        return
    }

    for (let jobs of jobList) {
        let new_line = document.createElement("br")
        let boody = document.querySelector("#third")
        let div = document.createElement("div")
        div.className = "JobData"
        let title = document.createElement("div")
        title.id = "jobHeading"
        title.innerText = jobs.title + " @ " + jobs.company.display_name
        div.append(title)
        div.append(new_line)

        let desc = document.createElement("div")
        desc.id = "jobDesc"
        desc.innerText = jobs.description
        div.append(desc)

        let category = document.createElement("div")
        category.id = "jobCategory"
        category.innerText = "Tags: " + jobs.category.label
        if (jobs.category.label)
            div.append(category)

        let location = document.createElement("div")
        location.id = "jobLocation"
        location.innerText = "Location: " + jobs.location.display_name
        div.append(location)

        let extras = document.createElement("div")
        extras.id = "jobExtras"
        let extra_str = ""
        if (jobs.contract_time === "full_time")
            extra_str += "Full Time, "
        if (jobs.contract_time === "part_time")
            extra_str += "Part Time, "
        if (jobs.contract_type)
            extra_str += jobs.contract_type
        extras.innerText = extra_str
        if (extras.innerText)
            div.append(extras)

        let minSal = document.createElement("div")
        minSal.id = "jobMinSalary"
        minSal.innerText = "Minimum Salary: " + jobs.salary_min
        if (jobs.salary_min)
            div.append(minSal)

        let contactLink = document.createElement("a")
        contactLink.href = jobs.redirect_url
        contactLink.id = "jobLink"
        contactLink.innerText = "Connect with us!!"
        div.append(contactLink)

        boody.append(div)
    }
    // resets the form after a query
    form.reset();
}

// GSAP plugin 
gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: "none", duration: 2 })
const tl = gsap.timeline()
const tl2 = gsap.timeline()
const tl4 = gsap.timeline()
tl4.from("#logo", { opacity: 0 })
tl.from(".black", { yPercent: -100 })

// scroll animation obj
ScrollTrigger.create({
    animation: tl,
    trigger: "#first",
    scrub: true,
    pin: true,
    anticipatePin: 1
})
tl2.from("#third", { yPercent: -100 })
ScrollTrigger.create({
    animation: tl2,
    trigger: "#second",
    scrub: true,
    pin: true,
    pinSpacing: false,
    anticipatePin: 1
})
// timeline for animation
const tl3 = gsap.timeline()
gsap.to("#furst", {
    scrollTrigger: {
        trigger: "#furst",
        toggleActions: "restart none reverse pause"
    },
    x: 212,
    duration: 2,
    delay: 0.5
})
gsap.to("#secnd", {
    scrollTrigger: {
        trigger: "#secnd",
        toggleActions: "restart none reverse pause"
    },
    x: 127,
    duration: 2,
    delay: 0.5
})
gsap.to("#thrd", {
    scrollTrigger: {
        trigger: "#thrd",
        toggleActions: "restart none reverse pause"
    },
    x: 44,
    duration: 2,
    delay: 0.5
})
gsap.to("#fourth", {
    scrollTrigger: {
        trigger: "#fourth",
        toggleActions: "restart none reverse pause"
    },
    x: -44,
    duration: 2,
    delay: 0.5
})
gsap.to("#fifth", {
    scrollTrigger: {
        trigger: "#fifth",
        toggleActions: "restart none reverse pause"
    },
    x: -127,
    duration: 2,
    delay: 0.5
})
gsap.to("#sixth", {
    scrollTrigger: {
        trigger: "#sixth",
        toggleActions: "restart none reverse pause"
    },
    x: -212,
    duration: 2,
    delay: 0.5
})

// fade in/out animation on scroll
let h2Headings = document.querySelectorAll("h2")
let bgimg2 = document.querySelector("#photoDiv img")

let currHeight = window.innerHeight
const elementInView = (el, percentageScroll = 100) => {
    // checks if element is in the viewport
    // height of element from top of page-page height
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= ((window.innerHeight) * (percentageScroll / 100)));
};
window.addEventListener("scroll", () => {
    let rate = window.pageYOffset * 0.75
    let target = document.querySelector("#logo")
    target.style.transform = "translateX(" + rate + "px)"
    for (heading of h2Headings) {
        if (elementInView(heading, 100)) {
            heading.classList.add("scrolled")
        }
        else {
            heading.classList.remove("scrolled")
        }
    }

    if (elementInView(bgimg2, 100))
        bgimg2.classList.add("scrolled")
    else
        bgimg2.classList.remove("scrolled")

})
// dynamic footer
let curr_date = new Date()
let curr_year = curr_date.getFullYear()
let footer = document.createElement("footer")
footer.id = "footer"
footer.style.backgroundColor = "#403e3e"
footer.innerHTML = +curr_year + " © Copyrights Reserved"
footer.style.color = "#f5f5f7"
footer.style.fontFamily = "Comfortaa"
footer.style.fontWeight = "400"
footer.style.display = "flex"
footer.style.justifyContent = "center"
main_body.append(footer)