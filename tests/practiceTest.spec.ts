//Practice File

//Step 1

//Get all article titles <a>
let articleLinks = document.querySelectorAll(".titleline")
//Store titles in an array
let titles = []

for(let i = 0; i < articleLinks.length; i++) {
    titles.push(articleLinks[i])
}


//Reverse Order Articles
titles.reverse()

//Print titles to console
console.log(titles)


//Step 2

//Click the More button and go to next page


//Step 3

//Repeat Step 1


//Step 4

//Repeat 1, 2, 3 until we reach article number 100 then stop