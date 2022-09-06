# ImageChef
###### Image chef is inspired / based off of [CyberChef](https://gchq.github.io/CyberChef/).
ImageChef is a simple web app for carrying out image processing tasks within the browser. These can be simple operations such as splitting an image into RGB channels, gray scaling, or more complex operations.

The app is built on top of the [OpenCV](https://opencv.org/) library, and is designed to allow for easy iamge manipulation for non-technical users and technical users without having to blindly test various image processing techniques.

## Live demo
ImageChef is still very much in development, as such it should not be considered a finished product and is expected to contain bugs / features yet to be implemented.

[If you wish to test it out, you can find a live demo here.][1]

## How it works
There are four main areas of the app:

 1. The **input** box in the top right, where you can upload an image to be processed or use a pre-loaded image.
 2. The **output** box in the bottom right, where the processed image will be displayed.
 3. The **operations** box on the far left where you can select which operation that ImageChef is capable of performing.
 4. The **recipe** area in the middle, where you can drag and drop operations in the order you wish them to be performed, and which arguments they use to perform them.

 Some examples of operations are:

- [Convert an image to GrayScale][2]

## Features
- Drag and drop
    - Operations can be dragged in or out of the recipe area to perform them or not.
    - They can be reoganised by dragging them up or down, allowing for certain operations to be performed before others.
- Auto Bake
    - Whenever the recipe or input image is modified, ImageChef will automatically "bake" for you and produce the output image.
    - This can be turned off if it is affecting performance. (if image is large, or recipe is complex)
- Pre-loaded data
    - Images
        - Certain images have been pre-loaded into the app for easy use.
        - These can be found in the **images** folder in the banner.
    - Recipes
        - Recipes can be pre-loaded into the app for easy use, such as grayscale, blur, and so on.
        - These can be found in the **recipes** folder in the banner.
- Breakpoints
    - Breakpoints allow you to view each step of the recipe as it is being performed.
    - This is useful for debugging and understanding the recipe.
- Save and Load
    - Images can be easily saved by right clicking the output image and selecting "Save Image".
    - Recipes can be easily saved by clicking the "Save Recipe" button. And loaded by clicking the "Load Recipe" button.
    - You can also copy the URL to easily share recipes.
- Search
    - If you know the name of an operation, or a word associated with an operation, you can search for it and find it in the operations box to find matching operations.
- Codeify

    - This will convert the opencv recipe into a snippet of code that can be pasted into a language that is supported by codeify.
        - Python3
        - JavaScript
        - TBD
- Client-Sided
    - ImageChef is entirely client-sided, meaning that no data such as images or recipes is sent to the server - All processing is carried out within your browser on your own machine.
    - Due to this, ImageChef can easily be downloaded and run locally on your machine.



[1]: https://example.com/
[2]: https://example.com/