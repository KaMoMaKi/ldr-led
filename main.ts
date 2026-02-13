/**
 * Punkt auf LED MATRIX bewegen
 */
input.onGesture(Gesture.TiltRight, function () {
    if ((Modus == "Set_Var" || Modus == "Send") && !(4 <= XAktuell)) {
        XAktuell += 1
        Display(false)
    }
})
input.onButtonEvent(Button.AB, input.buttonEventValue(ButtonEvent.LongClick), function () {
    Change_Mode("Set_Mode")
    basic.showNumber(Mode_num)
})
radio.onReceivedNumber(function (receivedNumber) {
    if (Modus == "Recieve") {
        if (receivedNumber == startKey) {
            empfangAktiv = true
            empfangenesBild = []
        } else if (empfangAktiv) {
            empfangenesBild.push(receivedNumber)
            if (empfangenesBild.length == matrixPixelAmount) {
                gespeichertesBild = empfangenesBild
                zeigeGespeichertesBild(gespeichertesBild)
                empfangAktiv = false
            }
        }
    }
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
    if (Modus == "Test") {
        pins.digitalWritePin(DigitalPin.P1, 1 - pins.digitalReadPin(DigitalPin.P1))
    }
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
    } else if (Modus == "Send") {
        if (0 == TempImage[YAktuell * matrixBreite + XAktuell]) {
            temp = 255
        } else {
            temp = 0
        }
        TempImage[YAktuell * matrixBreite + XAktuell] = temp
    }
})
input.onGesture(Gesture.TiltLeft, function () {
    if ((Modus == "Set_Var" || Modus == "Send") && !(XAktuell <= 0)) {
        XAktuell += -1
        Display(false)
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
            Display(true)
        } else if (Mode_num == 3) {
            Change_Mode("Test")
            Schreibe_digitalen_Wert("P0,P1,P,P3", 1)
        } else if (Mode_num == 4) {
            Change_Mode("Set_Mode")
            basic.showNumber(Mode_num)
        } else if (Mode_num == 5) {
            Change_Mode("Send")
            Display(true)
        } else if (Mode_num == 6) {
            Change_Mode("Recieve")
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
    } else if (Modus == "Send") {
        gespeichertesBild = TempImage
        sendeBildUeberFunk(gespeichertesBild)
    }
})
function Display (keep: boolean) {
    if (!(XAlt == XAktuell && YAlt == YAktuell)) {
        if (0 == TempImage[YAlt * matrixBreite + XAlt]) {
            led.unplot(XAlt, YAlt)
        }
        led.plot(XAktuell, YAktuell)
        XAlt = XAktuell
        YAlt = YAktuell
    }
}
input.onGesture(Gesture.LogoDown, function () {
    if ((Modus == "Set_Var" || Modus == "Send") && !(YAktuell <= 0)) {
        YAktuell += -1
        Display(false)
    }
})
input.onPinTouchEvent(TouchPin.P0, input.buttonEventDown(), function () {
    if (Modus == "Test") {
        pins.digitalWritePin(DigitalPin.P0, 1 - pins.digitalReadPin(DigitalPin.P0))
    }
})
function sendeBildUeberFunk (matrix: any[]) {
    if (matrix.length != matrixPixelAmount) {
        RGBLED(1, basic.rgb(255, 0, 0), 500)
        return
    }
    radio.sendNumber(startKey)
    for (let i = 0; i <= matrix.length - 1; i++) {
        radio.sendNumber(matrix[i])
        basic.pause(20)
    }
    RGBLED(1, basic.rgb(0, 255, 0), 500)
}
input.onPinTouchEvent(TouchPin.P2, input.buttonEventDown(), function () {
    if (Modus == "Test") {
        pins.digitalWritePin(DigitalPin.P2, 1 - pins.digitalReadPin(DigitalPin.P2))
    }
})
function zeigeGespeichertesBild (matrix: any[]) {
    if (matrix.length != matrixPixelAmount) {
        RGBLED(1, basic.rgb(255, 0, 0), 500)
        return
    }
    led.stopAnimation()
    for (let y = 0; y <= matrixHoehe - 1; y++) {
        for (let x = 0; x <= matrixBreite - 1; x++) {
            index = y * matrixBreite + x
            led.plotBrightness(x, y, matrix[index])
        }
    }
    RGBLED(1, basic.rgb(0, 255, 0), 500)
}
input.onGesture(Gesture.LogoUp, function () {
    if ((Modus == "Set_Var" || Modus == "Send") && !(4 <= YAktuell)) {
        YAktuell += 1
        Display(false)
    }
})
function leseLedMatrix () {
    let matrix: number[] = []
    for (let y = 0; y <= matrixHoehe - 1; y++) {
        for (let x = 0; x <= matrixBreite - 1; x++) {
            matrix.push(led.pointBrightness(x, y))
        }
    }
    RGBLED(1, basic.rgb(0, 255, 0), 500)
    return matrix
}
function RGBLED (num: number, Farbe: number, Pause: number) {
    for (let index2 = 0; index2 < num; index2++) {
        basic.pause(Pause)
        basic.setLedColor(Farbe)
        basic.pause(Pause)
        basic.turnRgbLedOff()
    }
}
input.onPinTouchEvent(TouchPin.P3, input.buttonEventDown(), function () {
    if (Modus == "Test") {
        pins.digitalWritePin(DigitalPin.P3, 1 - pins.digitalReadPin(DigitalPin.P3))
    }
})
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
    TempImage = []
    temp = 0
    for (let index2 = 0; index2 < matrixPixelAmount; index2++) {
        TempImage.push(temp)
    }
}
let LDR = 0
let index = 0
let YAlt = 0
let XAlt = 0
let TempImage: number[] = []
let YAktuell = 0
let temp = 0
let gespeichertesBild: number[] = []
let empfangenesBild: number[] = []
let empfangAktiv = false
let Mode_num = 0
let XAktuell = 0
let startKey = 0
let matrixPixelAmount = 0
let matrixHoehe = 0
let matrixBreite = 0
let Schalten2 = 0
let Schalten1 = 0
let Modus = ""
radio.sendNumber(0)
Modus = "Auto"
Schalten1 = 10
Schalten2 = 25
matrixBreite = 5
matrixHoehe = 5
matrixPixelAmount = matrixBreite * matrixHoehe
startKey = 9999
radio.setGroup(23)
basic.forever(function () {
    if (Modus == "Test") {
        basic.showNumber(pins.analogReadPin(AnalogReadWritePin.P2))
        basic.pause(100)
    } else if (Modus == "Auto") {
        LDR = pins.analogReadPin(AnalogReadWritePin.P2)
        if (Schalten1 > LDR) {
            ExternLEDSchalten(0, "P0")
        } else if (Schalten2 > LDR) {
            ExternLEDSchalten(1, "P1")
        } else {
            ExternLEDSchalten(3, "P3")
        }
    } else if (Modus == "Send") {
        if (0 == TempImage[YAktuell * matrixBreite + XAktuell]) {
            basic.pause(500)
            led.unplot(XAktuell, YAktuell)
            basic.pause(500)
            led.plot(XAktuell, YAktuell)
        }
    } else {
        basic.pause(500)
    }
})
