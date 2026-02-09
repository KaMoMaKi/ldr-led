input.onGesture(Gesture.TiltRight, function () {
    if (Modus == "Set_Var" && !(4 <= XAktuell)) {
        XAktuell += 1
        Display()
    }
})
input.onButtonEvent(Button.AB, input.buttonEventValue(ButtonEvent.LongClick), function () {
    Change_Mode("Set_Mode")
    basic.showNumber(Mode_num)
})
function ExternLEDSchalten (num: number, Pin: string) {
    if (Pin == "P0") {
        Schreibe_digitalen_Wert(Pin, 1)
        Schreibe_digitalen_Wert("P1PP3", 0)
    } else if (Pin == "P1") {
        Schreibe_digitalen_Wert(Pin, 1)
        Schreibe_digitalen_Wert("P0PP3", 0)
    } else if (Pin == "P2") {
        Schreibe_digitalen_Wert(Pin, 1)
        Schreibe_digitalen_Wert("P0P1P3", 0)
    } else if (Pin == "P3") {
        Schreibe_digitalen_Wert(Pin, 1)
        Schreibe_digitalen_Wert("P0P1P", 0)
    }
}
input.onPinTouchEvent(TouchPin.P1, input.buttonEventDown(), function () {
    basic.showNumber(Schalten2)
    Display()
})
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (Modus == "Set_Mode") {
        Mode_num += -1
        basic.showNumber(Mode_num)
    } else if (Modus == "Set_Var") {
        temp = XAktuell + 1 + YAktuell * 5
        if (temp < Schalten2) {
            Schalten1 = temp
            RGBLED(1, basic.rgb(0, 255, 0), 1000)
        } else {
            RGBLED(1, basic.rgb(255, 0, 0), 1000)
        }
    } else if (Modus == "Auto") {
        basic.showNumber(pins.analogReadPin(AnalogReadWritePin.P2))
    }
})
input.onGesture(Gesture.TiltLeft, function () {
    if (Modus == "Set_Var" && !(XAktuell <= 0)) {
        XAktuell += -1
        Display()
    }
})
function Schreibe_digitalen_Wert (Pin: string, num: number) {
    if (Pin.includes("P0")) {
        pins.digitalWritePin(DigitalPin.P0, num)
    }
    if (Pin.includes("P1")) {
        pins.digitalWritePin(DigitalPin.P1, num)
    }
    if (Pin.includes("P2")) {
        pins.digitalWritePin(DigitalPin.P2, num)
    }
    if (Pin.includes("P3")) {
        pins.digitalWritePin(DigitalPin.P3, num)
    }
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    if (Modus == "Set_Mode") {
        if (Mode_num == 1) {
            Change_Mode("Auto")
        } else if (Mode_num == 2) {
            Change_Mode("Set_Var")
            Display()
        } else if (Mode_num == 3) {
            Change_Mode("Set_Mode")
            basic.showNumber(Mode_num)
        }
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (Modus == "Set_Mode") {
        Mode_num += 1
        basic.showNumber(Mode_num)
    } else if (Modus == "Set_Var") {
        temp = 2 * (XAktuell + 1 + YAktuell * 5)
        if (temp > Schalten1) {
            Schalten2 = temp
            RGBLED(1, basic.rgb(0, 255, 0), 1000)
        } else {
            RGBLED(1, basic.rgb(255, 0, 0), 1000)
        }
    } else if (Modus == "") {
    	
    }
})
function Display () {
    if (!(XAlt == XAktuell && YAlt == YAktuell)) {
        led.unplot(XAlt, YAlt)
        led.plot(XAktuell, YAktuell)
        XAlt = XAktuell
        YAlt = YAktuell
        Debug += 1
    }
}
input.onGesture(Gesture.LogoDown, function () {
    if (Modus == "Set_Var" && !(YAktuell <= 0)) {
        YAktuell += -1
        Display()
    }
})
input.onPinTouchEvent(TouchPin.P0, input.buttonEventDown(), function () {
    basic.showNumber(Schalten1)
    Display()
})
input.onGesture(Gesture.LogoUp, function () {
    if (Modus == "Set_Var" && !(4 <= YAktuell)) {
        YAktuell += 1
        Display()
    }
})
function RGBLED (num: number, Farbe: number, Pause: number) {
    for (let index = 0; index < num; index++) {
        basic.pause(Pause)
        basic.setLedColor(Farbe)
        basic.pause(Pause)
        basic.turnRgbLedOff()
    }
}
function Change_Mode (Mode: string) {
    Modus = "Null"
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    XAlt = 0
    XAktuell = 2
    YAktuell = 2
    Mode_num = 1
    Schreibe_digitalen_Wert("P0P1P2P3", 0)
    RGBLED(2, basic.rgb(255, 0, 0), 500)
    Modus = Mode
}
let LDR = 0
let Debug = 0
let YAlt = 0
let XAlt = 0
let YAktuell = 0
let temp = 0
let Mode_num = 0
let XAktuell = 0
let Schalten2 = 0
let Schalten1 = 0
let Modus = ""
Modus = "Auto"
Schalten1 = 10
Schalten2 = 25
basic.forever(function () {
    if (Modus == "Set_Mode") {
    	
    } else if (Modus == "Auto") {
        LDR = pins.analogReadPin(AnalogReadWritePin.P2)
        if (Schalten1 > LDR) {
            ExternLEDSchalten(0, "P0")
        } else if (Schalten2 > LDR) {
            ExternLEDSchalten(1, "P1")
        } else {
            ExternLEDSchalten(3, "P3")
        }
    } else {
        basic.pause(500)
    }
})
