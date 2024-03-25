export const UP = "UP";
export const RIGHT = "RIGHT";
export const DOWN = "DOWN";
export const LEFT = "LEFT";

export const inputTypes = { ALL: "ALL", ARROWS: "ARROWS", WASD: "WASD" };

const { ALL, ARROWS, WASD } = inputTypes;

// Creates an Input class that listens for direction inputs and outputs the direction that was last pressed (and remembers previous ones)
export class Input {
    constructor(inputType) {
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                // UP
                case "ArrowUp":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowPressed(UP);
                    break;
                case "KeyW":
                    (inputType == WASD || inputType == ALL) && this.onArrowPressed(UP);
                    break;

                // RIGHT
                case "ArrowRight":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowPressed(RIGHT);
                    break;
                case "KeyD":
                    (inputType == WASD || inputType == ALL) && this.onArrowPressed(RIGHT);
                    break;

                // DOWN
                case "ArrowDown":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowPressed(DOWN);
                    break;
                case "KeyS":
                    (inputType == WASD || inputType == ALL) && this.onArrowPressed(DOWN);
                    break;

                // LEFT
                case "ArrowLeft":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowPressed(LEFT);
                    break;
                case "KeyA":
                    (inputType == WASD || inputType == ALL) && this.onArrowPressed(LEFT);
                    break;
            }
        });

        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                // UP
                case "ArrowUp":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowReleased(UP);
                    break;
                case "KeyW":
                    (inputType == WASD || inputType == ALL) && this.onArrowReleased(UP);
                    break;

                // RIGHT
                case "ArrowRight":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowReleased(RIGHT);
                    break;
                case "KeyD":
                    (inputType == WASD || inputType == ALL) && this.onArrowReleased(RIGHT);
                    break;

                // DOWN
                case "ArrowDown":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowReleased(DOWN);
                    break;
                case "KeyS":
                    (inputType == WASD || inputType == ALL) && this.onArrowReleased(DOWN);
                    break;

                // LEFT
                case "ArrowLeft":
                    (inputType == ARROWS || inputType == ALL) && this.onArrowReleased(LEFT);
                    break;
                case "KeyA":
                    (inputType == WASD || inputType == ALL) && this.onArrowReleased(LEFT);
                    break;
            }
        });

        this.directionsPressed = [];
    }

    get direction() {
        // console.log(this.directionsPressed);
        return this.directionsPressed[0];
    }

    // Smoother keyboard mechanics
    onArrowPressed(direction) {
        if (!this.directionsPressed.includes(direction)) {
            this.directionsPressed.unshift(direction);
        }
    }
    onArrowReleased(direction) {
        const idx = this.directionsPressed.indexOf(direction);
        if (idx !== -1) {
            this.directionsPressed.splice(idx, 1);
        }
    }
}
