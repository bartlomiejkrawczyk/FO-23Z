# Animation Starter Code, Focus on timerFired

from tkinter import *

####################################
# customize these functions
####################################


# Draws a bouncing square which can be paused
def init(data):
    data.squareLeft = 50
    data.squareTop = 50
    data.squareFill = "yellow"
    data.squareSize = 25
    data.squareSpeed = 20
    data.headingRight = True
    data.headingDown = True
    data.isPaused = False
    data.timerDelay = 50


def mousePressed(event, data):
    pass


def keyPressed(event, data):
    if (event.char == "p"):
        data.isPaused = not data.isPaused
    elif (event.char == "s"):
        doStep(data)


def timerFired(data):
    if (not data.isPaused):
        doStep(data)


def doStep(data):
    # Move vertically
    if (data.headingRight == True):
        if (data.squareLeft + data.squareSize > data.width):
            data.headingRight = False
        else:
            data.squareLeft += data.squareSpeed
    else:
        if (data.squareLeft < 0):
            data.headingRight = True
        else:
            data.squareLeft -= data.squareSpeed

    # Move horizontally
    if (data.headingDown == True):
        if (data.squareTop + data.squareSize > data.height):
            data.headingDown = False
        else:
            data.squareTop += data.squareSpeed
    else:
        if (data.squareTop < 0):
            data.headingDown = True
        else:
            data.squareTop -= data.squareSpeed


def redrawAll(canvas, data):
    # draw the square
    canvas.create_rectangle(data.squareLeft,
                            data.squareTop,
                            data.squareLeft + data.squareSize,
                            data.squareTop + data.squareSize,
                            fill=data.squareFill)
    # draw the text
    canvas.create_text(data.width/2, 20,
                       text="Pressing 'p' pauses/unpauses timer")
    canvas.create_text(data.width/2, 40,
                       text="Pressing 's' steps the timer once")
####################################
# use the run function as-is
####################################


def run(width=300, height=300):
    def redrawAllWrapper(canvas, data):
        canvas.delete(ALL)
        canvas.create_rectangle(0, 0, data.width, data.height,
                                fill='white', width=0)
        redrawAll(canvas, data)
        canvas.update()

    def mousePressedWrapper(event, canvas, data):
        mousePressed(event, data)
        redrawAllWrapper(canvas, data)

    def keyPressedWrapper(event, canvas, data):
        keyPressed(event, data)
        redrawAllWrapper(canvas, data)

    def timerFiredWrapper(canvas, data):
        timerFired(data)
        redrawAllWrapper(canvas, data)
        # pause, then call timerFired again
        canvas.after(data.timerDelay, timerFiredWrapper, canvas, data)
    # Set up data and call init

    class Struct(object):
        pass
    data = Struct()
    data.width = width
    data.height = height
    data.timerDelay = 100  # milliseconds
    root = Tk()
    init(data)
    # create the root and the canvas
    canvas = Canvas(root, width=data.width, height=data.height)
    canvas.configure(bd=0, highlightthickness=0)
    canvas.pack()
    # set up events
    root.bind("<Button-1>", lambda event:
              mousePressedWrapper(event, canvas, data))
    root.bind("<Key>", lambda event:
              keyPressedWrapper(event, canvas, data))
    timerFiredWrapper(canvas, data)
    # and launch the app
    root.mainloop()  # blocks until window is closed
    print("bye!")


run(400, 200)
