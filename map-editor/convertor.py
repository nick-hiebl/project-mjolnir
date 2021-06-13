# Converter.py
s = """3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,47,49,2,2,2,2,8,2,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,2,5,2,0,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,3,3,3,3,3
3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,7,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3"""

mp = {'0':'2', '10':'2', '20':'2', # crate
      '1':'3', # collectable
      '2':'0', # empty
      '3':'1', # solid
      '4':'5', # button
      '5':'4', '6':'4', '11':'4', '21':'4', # door
      '7':'9', '17':'9', # exit
      '8':'6', '9':'6', # battery
      'X':'0', '45':'0', # player
      '46':'0', '47':'0', '48':'0', '49':'0', # hammer
      '^':'0', 'v':'0', '<':'0', '>':'0', # hammer pt. 2
}

def matrixTranspose(anArray):
    return list(zip(*anArray))

arr = []
for i in s.split('\n'):
    arr.append(i.split(','))
arr = matrixTranspose(arr)

player_pos = (1,1)
hammer_pos = None

doors = []
buttons = []
batteries = []

for y in range(len(arr)):
    arr[y] = list(arr[y])
    for x in range(len(arr[y])):
        letter = arr[y][x]
        arr[y][x] = mp[letter]

        if letter == 'X' or letter == '49':
            player_pos = (y, x)
        elif letter in '<^>v':
            hammer_pos = (y, x, '^>v<'.find(letter))
        elif letter in ['45', '46', '47', '48']:
            hammer_pos = (y, x, ['45', '46', '47', '48'].index(letter))
        elif letter in ['5', '6']:
            doors.append('''{{ id: DOOR_ID, i: {}, j: {}, state: DOOR.CLOSED }}'''.format(y, x))
        elif letter == '4':
            buttons.append('''{{ id: BUTTON_ID, i: {}, j: {}, state: BUTTON.UNPRESSED }}'''.format(y, x))
        elif letter == '8':
            batteries.append('''{{ id: BATTERY_ID, i: {}, j: {}, powered: false }}'''.format(y, x))

    arr[y] = ''.join(arr[y])

if not hammer_pos:
    hammer_pos = (player_pos[0], player_pos[1], 1)

arr = '\n'.join(arr)

s = '''var <LEVEL_NAME> = {{
    level_string: `{}`,
    player: {{
        i: {},
        j: {},
    }},
    hammer: {{
        i: {},
        j: {},
        facing: {},
    }},
    doors: [
        {}
    ],
    buttons: [
        {}
    ],
    batteries: [
        {}
    ],
}};'''.format(
    arr,
    *player_pos,
    *hammer_pos,
    ',\n        '.join(doors),
    ',\n        '.join(buttons),
    ',\n        '.join(batteries),
)

print(s)
