# Converter.py
s = """3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,7,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,5,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,8,0,2,5,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3
3,3,3,3,3,3,>,X,2,2,0,2,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,2,2,2,3,2,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,8,0,2,2,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3"""

# Mark player start position with 'X'
# Mark hammer start position with '<', '>', '^', 'v' (pointing in direction of handle)

mp = {'0':'2',
      '1':'3',
      '2':'0',
      '3':'1',
      '4':'5',
      '5':'4',
      '6':'4',
      '7':'9',
      '8':'6',
      'X':'0',
      '^':'0',
      'v':'0',
      '<':'0',
      '>':'0',
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

        if letter == 'X':
            player_pos = (y, x)
        elif letter in '<^>v':
            hammer_pos = (y, x, '^>v<'.find(letter))
        elif letter in '56':
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
