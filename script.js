const Default_Size = 16;
const Default_Color = "rgba(255,255,255, 1)";
const Default_Mode = "color";

let currSize = Default_Size;
let currColor = Default_Color;
let currMode = Default_Mode;
let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function setSize(size) {
  currSize = size;
}

function setColor(color) {
  currColor = color;
}

function setMode(mode) {
  currMode = mode;
}

function setUpGrid(size) {
  const tempSize = [16, 32, 64];
  for (let j in tempSize) {
    if (tempSize[j] !== size) {
      $("#grid-container").removeClass(
        `grid-cols-${tempSize[j]} grid-rows-${tempSize[j]}`
      );
    }
  }
  $("#grid-container").addClass(`grid-cols-${size} grid-rows-${size}`);
  for (let i = 0; i < size * size; i++) {
    const grid = $("<div></div>");
    grid.addClass("border", "grid");
    $("#grid-container").append(grid);
    grid.on("mouseover", changeColor);
    grid.on("mousedown", changeColor);
  }
}

function clearGrid(size) {
  $("#grid-container").html("");
  setUpGrid(size);
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const rgb = `rgba(${r},${g},${b})`;
  return rgb;
}

function rgbToHsl(rgb) {
  let [r, g, b] = [...rgb];
  [r, g, b] = [r / 255, g / 255, b / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;
  const s =
    (r == g) == b
      ? 0
      : l <= 0.5
      ? (max - min) / (max + min)
      : (max - min) / (2.0 - max - min);
  let h = 0;
  if (r > g && r > b) {
    h = (g - b) / (max - min);
  }
  if (g > r && g > b) {
    h = 2.0 + (b - r) / (max - min);
  }
  if (b > r && b > g) {
    h = 4.0 + (r - g) / (max - min);
  }

  return [
    Math.floor(Math.abs(h) * 60),
    Math.floor(s * 100),
    Math.floor(l * 100),
  ];
}

const regex = /\d+(?:,\d+)*/g;
function changeColor(e) {
  let rgbValues = $(this).css("background-color");
  let rgbArr = rgbValues.match(regex);
  const bwColor = rgbArr.every((a) => a == 0 || a == 255);
  if (e.type == "mouseover" && !mouseDown) return;
  if (currMode === "color") {
    if (bwColor) {
      $(this).css("background-color", randomColor);
    } else {
      if (e.type == "mouseOver" && !mouseDown) {
        $(this).css("background-color", Default_Color);
      } else {
        let [h, s, l] = rgbToHsl(rgbArr);
        $(this).css(
          "background-color",
          `hsl(${h - 5}, ${s}%, ${Math.round(l) - 5}%)`
        );
      }
    }
  } else {
    $(this).css("background-color", Default_Color);
  }
}

$("option").on("click", function () {
  setSize($(this).val());
  clearGrid(currSize);
});

$("#clear").on("click", function () {
  clearGrid(currSize);
});

$("#erase").on("click", function () {
  setMode("erase");
  $(this).hide();
  $("#color").show();
});

$("#color").on("click", function () {
  setMode("color");
  $(this).hide();
  $("#erase").show();
});

setUpGrid(currSize);
