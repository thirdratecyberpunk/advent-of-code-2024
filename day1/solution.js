#!/usr/bin/env node
const fs = require ('fs');
const readline = require ('readline');

/**
 * Returns whether an array only contains numeric types
 * @param {*} array 
 * @returns 
 */
function arrayContainsOnlyNumbers(array) {
    return array.every(element => {
        return typeof element === 'number';
    })
}


/**
 * Takes in an array of two arrays
 * and returns the total distance between the two lists
 */
function totalDistanceBetweenLocationLists(lists){
    // check that the list of lists contains 2 lists
    if (lists.length != 2){
        throw new Error('Expecting two location lists');
    }
    // checks that the lists only contain integers
    if (!lists.every(element => {
        return arrayContainsOnlyNumbers(element)
    })){
        throw new Error('Expecting lists to only contain integers');
    }

    // checks that the lists are the same size
    if (lists[0].length != lists[1].length){
        throw new Error('Expecting location lists to be same size');
    }

    // sort the lists descending by size
    let leftList = lists[0].sort((a,b) => { return a - b});
    let rightList = lists[1].sort((a,b) => { return a - b});

    // calculates the absolute distance between the two arrays (bigger - smaller)
    return leftList.map((item, index) => {
        return Math.abs(item - rightList[index]);
    })
    // summates the differences
    .reduce((result, item ) => {
        return result + item
    });
}

/** 
 * takes a text file in expected delimited format and returns two arrays 
 * */
async function inputToExpectedStructure(filename){
    try {  
        const fileStream = fs.createReadStream(filename);
        
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
          });
        
        let leftList = [];
        let rightList = [];

        for await (const line of rl){
            // split the line by the tab
            const lineValues = line.split("   ");
            // if the line is in the expected format, append it to the arrays
            if (lineValues.length == 2){
                leftList.push(parseInt(lineValues[0]));
                rightList.push(parseInt(lineValues[1]));
            }
            // otherwise throw an error
            else{
                throw new Error("Unexpected file structure in input");
            }
        }
        return [leftList, rightList];  
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

(async function run() {
    try {
        let filename = process.argv[2];
        const locationLists = await inputToExpectedStructure(filename);
        console.log(locationLists);
        console.log(totalDistanceBetweenLocationLists(locationLists));
    }
    catch (e){
        console.log(e);
    }
})();


module.exports = { totalDistanceBetweenLocationLists,  inputToExpectedStructure }