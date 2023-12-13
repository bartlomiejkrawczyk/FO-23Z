import numpy as np
import cv2
from tkinter import Tk, Label, Button, Canvas, NW
from PIL import Image, ImageTk

dupa = None


def sin2d(x, y):
    """2-d sine function to plot"""
    return np.sin(x) + np.cos(y)


def getFrame():
    global dupa
    """Generate next frame of simulation as numpy array"""

    # Create data on first call only
    if dupa is None:
        xx, yy = np.meshgrid(np.linspace(0, 2*np.pi, 100),
                             np.linspace(0, 2*np.pi, 100))
        dupa = sin2d(xx, yy)
        dupa = cv2.normalize(
            dupa, None, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)

    # Just roll data for subsequent calls
    dupa = np.roll(dupa, (1, 2), (0, 1))
    return dupa


class SimulationWindow:

    def __init__(self, width: int = 512, height: int = 512):
        self.master = Tk()
        self.master.title("Radar model")

        self.quote_label = Label(self.master)
        self.quote_label.configure(text="Dupa")
        self.quote_label.grid(row=0, column=0, rowspan=1)

        self.restart_button = Button(
            self.master,
            text='Restart',
            command=self.restart,
            width=30
        )
        self.restart_button.grid(row=1, column=0, rowspan=1)

        self.canvas = Canvas(self.master, width=300, height=512)
        self.canvas.grid(row=2, column=0, rowspan=1)
        self.img = np.ones((300, 512, 3), np.uint8)
        im = Image.fromarray(self.img)
        # Prevent from recycling the shown_canvas xD
        self.shown_canvas = ImageTk.PhotoImage(image=im)
        self.image_id = self.canvas.create_image(0, 0, image=self.shown_canvas)
        # self.update_image()

    def restart(self):
        self.update_image()

    def update_image(self):
        self.img = getFrame()
        print(f'IMAGE')

        im = Image.fromarray(self.img)
        # Prevent from recycling the shown_canvas xD
        self.shown_canvas = ImageTk.PhotoImage(image=im)
        self.canvas.itemconfigure(self.image_id, image=self.shown_canvas)
        self.canvas.after(1, self.update_image)

    def start(self):
        self.master.mainloop()


if __name__ == "__main__":
    app = SimulationWindow()
    app.start()
