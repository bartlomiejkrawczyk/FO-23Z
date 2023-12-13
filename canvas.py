import cv2
import numpy as np

WINDOW = 'FO'


def nothing(x: int):
    pass


def restart(state: int):
    pass


# Create a black image, a window
img = np.zeros((300, 512, 3), np.uint8)

cv2.namedWindow(WINDOW)

# create trackbars for color change
cv2.createButton("Back", nothing, None, cv2.QT_PUSH_BUTTON, 1)
cv2.createTrackbar('R', WINDOW, 0, 255, nothing)
cv2.createTrackbar('G', WINDOW, 0, 255, nothing)
cv2.createTrackbar('B', WINDOW, 0, 255, nothing)

# create switch for ON/OFF functionality
switch = '0 : OFF \n1 : ON'
cv2.createTrackbar(switch, WINDOW, 0, 1, nothing)


while True:
    cv2.imshow(WINDOW, img)
    k = cv2.waitKey(1) & 0xFF
    if k == 27:
        break

    if cv2.getWindowProperty(WINDOW, cv2.WND_PROP_VISIBLE) < 1:
        break

    # get current positions of four trackbars
    r = cv2.getTrackbarPos('R', WINDOW)
    g = cv2.getTrackbarPos('G', WINDOW)
    b = cv2.getTrackbarPos('B', WINDOW)
    s = cv2.getTrackbarPos(switch, WINDOW)

    if s == 0:
        img[:] = 0
    else:
        img[:] = [b, g, r]
    for x in range(512):
        for y in range(300):
            img[y][x][0] += 10
            img[y][x][2] += 10
    print(f'IMAGE')

cv2.destroyAllWindows()
