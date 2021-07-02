import os
from tkinter import *
from pathlib import Path
import webbrowser
import re

BACKGROUND_COLOR = '#191919'
BACKGROUND_COLOR_BUTTON = '#252525'

get_address_path_arr = list(Path(".").rglob('getAddress.js'))
get_address_path = ''
if len(get_address_path_arr) != 0:
    get_address_path = str(get_address_path_arr[0])

pipe = os.popen('node ' + get_address_path)
address = pipe.readline()
address_text = 'IP - адрес:' + (' ' * 4) + address
server_path_arr = list(Path(".").rglob('startServer.bat'))

if len(get_address_path_arr) == 0:
    address_text = 'Адрес не найден'

window = Tk()
window.title('Радиостанция Р-180')
window.configure(width=500, height=125, bg=BACKGROUND_COLOR)
window.resizable(width=False, height=False)
window.pack_propagate(False)
window.grid_propagate(False)

icon_path_arr = list(Path(".").rglob('icon.png'))
if len(icon_path_arr) != 0:
    icon = PhotoImage(file=icon_path_arr[0])
    window.iconphoto(False, icon)

winWidth = window.winfo_reqwidth()
winwHeight = window.winfo_reqheight()
posRight = int(window.winfo_screenwidth() / 2 - winWidth / 2)
posDown = int(window.winfo_screenheight() / 2 - winwHeight / 2)
window.geometry('+{}+{}'.format(posRight, posDown))


def open_github():
    webbrowser.open('https://github.com/Nikola-Ver', new=0, autoraise=True)

def open_client():
    webbrowser.open(address, new=0, autoraise=True)


def start_server(path_to_launcher, is_recording):
    os.system('cd ' + path_to_launcher + ' && start startServer.bat' +
              (' recording' if is_recording else ''))


Label(window, text='Меню запуска программы', fg='white', bg=BACKGROUND_COLOR, font='Arial 16 bold')\
    .pack(side=TOP, pady=5)
if len(server_path_arr) != 0:
    server_path = re.sub(r'\\startServer.bat.*', '', str(server_path_arr[0]))
    Label(window, text='Включить сервер:', fg='white', bg=BACKGROUND_COLOR, font='Arial 12 bold')\
        .grid(row=0, column=0, padx=5, pady=50)
    Button(window, command=lambda: start_server(server_path, True), width=18, text='Запуск с записью', fg='white', bg=BACKGROUND_COLOR_BUTTON, font='Arial 10')\
        .grid(row=0, column=1, padx=5)
    Button(window, command=lambda: start_server(server_path, False), width=18, text='Обычный запуск', fg='white', bg=BACKGROUND_COLOR_BUTTON, font='Arial 10')\
        .grid(row=0, column=2, padx=5)
    Label(window, text=address_text, fg='white', bg=BACKGROUND_COLOR, font='Arial 12 bold')\
        .place(x=5, y=90)
    Button(window, command=open_client, width=18, text='Перейти по IP', fg='white', bg=BACKGROUND_COLOR_BUTTON, font='Arial 10')\
        .place(x=333, y=90)
else:
    Label(window, text='Не найдены компоненты сервера программы!', fg='white', bg=BACKGROUND_COLOR, font='Arial 12 bold')\
        .pack(side=TOP, anchor=N, expand=True, pady=15)


icon_path_arr = list(Path(".").rglob('github.png'))
if len(icon_path_arr) != 0:
    canvas = Canvas(window, highlightthickness=0,
                    bg=BACKGROUND_COLOR, width=32, height=32)
    canvas.place(x=7, y=7)
    img = PhotoImage(file=icon_path_arr[0])
    canvas.create_image(0, 0, anchor=NW, image=img)
    canvas.bind("<Button-1>", lambda e: open_github())

window.mainloop()
