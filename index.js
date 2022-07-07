// write ("npm init-y") in terminal to create package.json with metadata 
// npm install robotjs ; Prepares robotJs to be used in program

// import the RobotJs library
var robot = require('robotjs');

//declaring coordinate variables

function main() {
    console.log("Hecking RuneScrape....");
    sleep(4000);

    // infinity loop, use ctrl + alt + M to stop the program(VSC)
    while (true) {
        // If we can't find a tree write an error message and exit the loop
        var tree = findTree();
        if (tree == false) {
            rotateCamera();        
        }
         // Chop down the tree we found
        robot.moveMouse(tree.x, tree.y);
        //sleep(300);
       // confirmTrx();
        robot.mouseClick();
        sleep(3000);
        dropLogs();
    }
    console.log("Hecking Complete.");
}

// Function to find trees by color sampling of a screenshot
function findTree(){
    x = 300, y = 300, width = 1300, height = 400;
    var img = robot.screen.capture(x, y, width, height);
    
    var treeColors = ["836a45","866c47","9c7e53","806743","685437","77603d"];

    for (var i = 0; i < 2000; i++) {
        var random_x = getRandomInt(0, width-1); 
        var random_y = getRandomInt(0, height-1);
        var sample_color = img.colorAt(random_x, random_y);

        if (treeColors.includes(sample_color)) {
            var screen_x = random_x + x;
            var screen_y = random_y + y;    
            if (confirmTree(screen_x,screen_y)) {

            console.log ('Found Tree at:' + screen_x, screen_y + 'color' + sample_color);
            return {x: screen_x, y: screen_y};
            } else {
                console.log('Unconfirmed Tree at:' + screen_x, screen_y + 'color' + sample_color);
            }
        }
    }   
    // Did not find the color in our screenshot
    return false;
}


//testing function to try new confirmation function "IT WORKED"
function confirmTrx() {
    var mouse_x;
    var mouse_y;
    robot.getMousePos();
    var confirm_hex = robot.getPixelColor(mouse_x + 62, mouse_y - 17);
    console.log('Tooltip text color is:' + confirm_hex + ' at' + mouse_x, mouse_y);
}       



function testScreenCapture() {
    // taking a screenshot
    var img = robot.screen.capture(0, 0, 1920, 1080);

    var pixelColor = img.colorAt(30, 80);
    console.log(pixelColor);
}

//drop logs from inventory
function dropLogs() {
    var inventory_x = 1738;
    var inventory_y= 775;
    var inventory_log_color = '7a6240';
    var pixel_color = robot.getPixelColor(inventory_x, inventory_y);
    console.log('Inventory log color is:', pixel_color);
    
    var wait_cycles = 0;
    var max_wait_cycles = 9;
   
     while (pixel_color != inventory_log_color && wait_cycles < max_wait_cycles) {
        // we don't have a log in our inventory yet at the expected position.
        // waiting a little bit longer to see if the chopping finishes
        sleep(1000);
        // sample the pixel color again after waiting
        pixel_color = robot.getPixelColor(inventory_x, inventory_y);
        // increment our counter
        wait_cycles++;
    }

     //Drop logs from the inventory if the pixel matches the log color  3e3529
    if (pixel_color == inventory_log_color){ 
        robot.moveMouse(inventory_x, inventory_y);
        robot.mouseClick('right');
        sleep(1000);
        
        robot.moveMouse(inventory_x, inventory_y + 40); 
        robot.mouseClick();
    }
}

//creating sleep function
function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function getRandomInt (min, max){
    min = Math.ceil(min); 
    max = Math.floor(max);
    return Math.floor (Math.random() * (max - min +1)) + min;
}

function rotateCamera() {
    console.log("Rotating camera");
    robot.keyToggle('right', 'down');
    sleep(1000);
    robot.keyToggle('right', 'up');
}

// Sample text color in top left corner to confirm tree existence
function confirmTree(screen_x,screen_y) {
    robot.moveMouse(screen_x, screen_y);
    // wait a bit for the help text to appear
    sleep(300);

    //now get the pixel color 108x,37y rbg 14 210 205
    var check_pixel_color = robot.getPixelColor(screen_x + 80, screen_y - 10);

    //return check_pixel_color == "0ED297"
    return check_pixel_color == "00ffff"
}



// running main function
    main();

