export class KeyboardListener
{
    constructor(value)
    {
        this.value = value;
        this.isDown = false;
        this.isUp = true;
        this.press = () => {};
        this.release = () => {};
        this.pressed = 0;
        this.released = 0;

        this.downListener = this._downHandler.bind(this);
        this.upListener = this._upHandler.bind(this);
        window.addEventListener("keydown", this.downListener, false);
        window.addEventListener("keyup", this.upListener, false);
    }

    //The `downHandler`
    _downHandler(event) {
        if (event.key === this.value || event.keyCode == this.value) {
            if(this.isUp) {
                this.press();
                this.pressed = !paused;
            }
            this.isDown = true;
            this.isUp = false;
            event.preventDefault();
        }
    }

    //The `upHandler`
    _upHandler(event) {
        if (event.key === this.value || event.keyCode == this.value) {
            if(this.isDown) {
                this.release();
                this.released = !paused;
            }
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
        }
    }

    // Detach event listeners
    unsubscribe() {
        window.removeEventListener("keydown", this.downListener);
        window.removeEventListener("keyup", this.upListener);
    }
}
