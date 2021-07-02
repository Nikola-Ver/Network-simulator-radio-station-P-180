import os
from tkinter import *

BACKGROUND_COLOR = '#191919'
BACKGROUND_COLOR_BUTTON = '#252525'

pipe = os.popen('node getAddress.js')
address = pipe.readline()

window = Tk()
window.title('Радиостанция Р-180')
window.configure(width=500, height=250, bg=BACKGROUND_COLOR)
window.pack_propagate(False)

icon = PhotoImage(file='./img/icon.png')
window.iconphoto(False, icon)

winWidth = window.winfo_reqwidth()
winwHeight = window.winfo_reqheight()
posRight = int(window.winfo_screenwidth() / 2 - winWidth / 2)
posDown = int(window.winfo_screenheight() / 2 - winwHeight / 2)
window.geometry('+{}+{}'.format(posRight, posDown))

Label(window, text='Меню заупска программы', fg='white', bg=BACKGROUND_COLOR, font='Arial 16 bold')\
    .pack(side=TOP, pady=5)
Label(window, text='Включить сервер:', fg='white', bg=BACKGROUND_COLOR, font='Arial 12 bold')\
    .pack(side=LEFT, anchor=NW, expand=True, padx=5, pady=15)
Button(window, width=18, text='Запуск с записью', fg='white', bg=BACKGROUND_COLOR_BUTTON, font='Arial 10')\
    .pack(side=LEFT, anchor=NW, expand=True, padx=5, pady=15)
Button(window, width=18, text='Обычный запуск', fg='white', bg=BACKGROUND_COLOR_BUTTON, font='Arial 10')\
    .pack(side=LEFT, anchor=NW, expand=True, padx=5, pady=15)

window.mainloop()
