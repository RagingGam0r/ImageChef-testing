var javascript = `// NOTE: Javascript is partially supported
// But some features are not and **will** require you to manually add them. 
// Such as cv.Mat / cv.Scalar
// Or replace certain features e.g replace (0, 0, 0) with [0, 0, 0]
// This is because I am not familiar with javascript and I am not sure how to implement some features.
// Javascript code generated by ImageChef (https://example.com)\n
console.log("Javascript code generated by ImageChef (https://example.com)");
console.log("ImageChef was created by @RagingGam0r on GitHub (https://github.com/RagingGam0r)");
console.log("ImageChef (https://example.com) is a free and open source project, please consider using it to make your own image processing projects!");
cv = require('./opencv.js');
const img = cv.imread('INPUTimg.png');

cv.imshow = function (name, img) { // Overwrites cv.imshow to save image to disk, remove function to disable this.
    cv.imwrite(\`\$\{name\}.png\`, img);
}

let resize_0 = cv.resize(INPUTimg, (100, 100), 0, 0, cv.INTER_LINEAR)
let cvtColor_1 = cv.cvtColor(resize_0, cv.COLOR_BGR2XYZ)
let cvtColor_2 = cv.cvtColor(cvtColor_1, cv.COLOR_RGB2HSV)
let inRange_3 = cv.inRange(cvtColor_2, (91, 47, 169), (111, 255, 249))
let bitwise_and_4 = cv.bitwise_and(cvtColor_2, cvtColor_2, None)
let inRange_5 = cv.inRange(bitwise_and_4, (28, 75, 110), (48, 255, 255))
let bitwise_and_6 = cv.bitwise_and(resize_0, resize_0, inRange_3)
let bitwise_and_7 = cv.bitwise_and(resize_0, resize_0, inRange_5)

console.log("Thank you for using ImageChef (https://example.com)|(https://github.com/RagingGam0r)!");

// Display images and break points
cv.imshow("bitwise_and_6", bitwise_and_6)
cv.imshow("final", bitwise_and_7)
cv.waitKey(0)
cv.destroyAllWindows()
`

export default javascript