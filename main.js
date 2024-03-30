// Canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
context.imageSmoothingEnabled = false

// Sprites
const spritesheet = new Image()
spritesheet.src = 'images/spritesheet.png'

const sprites = {
	helicopter0: {spriteX:0, spriteY:0, spriteWidth:24, spriteHeight:16},
	helicopter1: {spriteX:24, spriteY:0, spriteWidth:24, spriteHeight:16},
	helicopter2: {spriteX:48, spriteY:0, spriteWidth:24, spriteHeight:16},
	helicopter3: {spriteX:72, spriteY:0, spriteWidth:24, spriteHeight:16},
	arrow: {spriteX:96, spriteY:0, spriteWidth:16, spriteHeight:16},
	snake: {spriteX:0, spriteY:40, spriteWidth:32, spriteHeight:88},
	ball: {spriteX:32, spriteY:48, spriteWidth:32, spriteHeight:32},
	skull: {spriteX:32, spriteY:80, spriteWidth:32, spriteHeight:40},
	explosion1: {spriteX:0, spriteY:16, spriteWidth:16, spriteHeight:16},
	explosion2: {spriteX:16, spriteY:16, spriteWidth:24, spriteHeight:24},
	explosion3: {spriteX:40, spriteY:16, spriteWidth:32, spriteHeight:32},
	explosion4: {spriteX:72, spriteY:16, spriteWidth:40, spriteHeight:40},
	explosion5: {spriteX:112, spriteY:16, spriteWidth:40, spriteHeight:40},
	explosion6: {spriteX:152, spriteY:16, spriteWidth:40, spriteHeight:40},
	explosion7: {spriteX:192, spriteY:16, spriteWidth:40, spriteHeight:40},
	level1: {spriteX:0, spriteY:128, spriteWidth:128, spriteHeight:128},
	level2: {spriteX:128, spriteY:128, spriteWidth:128, spriteHeight:128},
	level3: {spriteX:0, spriteY:256, spriteWidth:128, spriteHeight:128},
	level4: {spriteX:128, spriteY:256, spriteWidth:128, spriteHeight:128},
	level5: {spriteX:0, spriteY:384, spriteWidth:128, spriteHeight:128},
	level6: {spriteX:128, spriteY:384, spriteWidth:128, spriteHeight:128},
	level7: {spriteX:256, spriteY:384, spriteWidth:128, spriteHeight:128},
	level8: {spriteX:384, spriteY:384, spriteWidth:128, spriteHeight:128}
}

function draw(sprite, x, y, angle = 0, width = sprites[sprite].spriteWidth, height = sprites[sprite].spriteHeight) {
	let {spriteX, spriteY, spriteWidth, spriteHeight} = sprites[sprite]
	angle *= Math.PI / 180
	context.save()
	context.translate(x, y)
	context.rotate(angle)
	context.translate(-width/2, -height/2)
	context.drawImage(spritesheet, spriteX, spriteY, spriteWidth, spriteHeight, 0, 0, width, height)
	context.restore()
}

// Backgrounds
const backgrounds = {
	sky: {x:256, y:0, position:0, speed:10},
	sunset: {x:256, y:128, position:0, speed:10},
	night: {x:256, y:256, position:0, speed:0},
	night2: {x:256, y:256, position:0, speed:20}
}

function drawBackground(background) {
	let {x,y,position,speed} = backgrounds[background]
	context.drawImage(spritesheet, x+1, y+1, 254, 126, -position, 0, 512, 256)
	context.drawImage(spritesheet, x+1, y+1, 126, 126, -position + 512, 0, 256, 256)
	backgrounds[background].position = (position + speed * deltaTime) % 512
}

// Helicopter
const helicopter = {
	x: 127,
	y: 127,
	frame: 0,
	explosionFrame: 1,
	dead: false
}

// Enemies
let enemies = []
class Enemy {
	constructor(sprite, x, y, movementX, speedX, directionX, movementY, speedY, directionY, collisionPoints) {
		this.sprite = sprite
		this.x = x
		this.y = y
		this.originX = x
		this.originY = y
		this.movementX = movementX
		this.speedX = speedX
		this.directionX = directionX
		this.movementY = movementY
		this.speedY = speedY
		this.directionY = directionY
		this.collisionPoints = collisionPoints
	}
}

class Snake extends Enemy {
	constructor(x, y) {
		super(
			'snake', x, y, 0, 0, 1, 72, 0.12, 1,
			[
				{x1: -4, y1:44, x2:-8, y2: -40},
				{x1: -8, y1:-40, x2:12, y2: -30},
				{x1: 12, y1:-30, x2:4, y2: 44}
			] 
		)
	}
}

class Ball extends Enemy {
	constructor(x, y) {
		super(
			'ball', x, y, 80, 0.1, 1, 20, 0.05, -1,
			[
				{x1:-6, y1:-13, x2:6, y2:-13},
				{x1:6, y1:-13, x2:13, y2:-6},
				{x1:13, y1:-6, x2:13, y2:6},
				{x1:13, y1:6, x2:6, y2:13},
				{x1:6, y1:13, x2:-6, y2:13},
				{x1:-6, y1:13, x2:-13, y2:6},
				{x1:-13, y1:6, x2:-13, y2:-6},
				{x1:-13, y1:-6, x2:-6, y2:-13}
			] 
		)
	}
}

class Ball2 extends Enemy {
	constructor(x, y) {
		super(
			'ball', x, y, 80, 0.1, -1, 20, 0.05, -1,
			[
				{x1:-6, y1:-13, x2:6, y2:-13},
				{x1:6, y1:-13, x2:13, y2:-6},
				{x1:13, y1:-6, x2:13, y2:6},
				{x1:13, y1:6, x2:6, y2:13},
				{x1:6, y1:13, x2:-6, y2:13},
				{x1:-6, y1:13, x2:-13, y2:6},
				{x1:-13, y1:6, x2:-13, y2:-6},
				{x1:-13, y1:-6, x2:-6, y2:-13}
			] 
		)
	}
}

class Skull extends Enemy {
	constructor(x, y) {
		super(
			'skull', x, y, 50, 0.08, 1, 75, 0.12, -1,
			[
				{x1:-6, y1:-15, x2:6, y2:-15},
				{x1:6, y1:-15, x2:13, y2:-8},
				{x1:13, y1:-8, x2:10, y2:10},
				{x1:10, y1:10, x2:0, y2:18},
				{x1:0, y1:18, x2:-10, y2:10},
				{x1:-10, y1:10, x2:-13, y2:-8},
				{x1:-13, y1:-8, x2:-6, y2:-15}
			] 
		)
	}
}

class Skull2 extends Enemy {
	constructor(x, y) {
		super(
			'skull', x, y, 30, 0.08, 1, 45, 0.12, 1,
			[
				{x1:-6, y1:-15, x2:6, y2:-15},
				{x1:6, y1:-15, x2:13, y2:-8},
				{x1:13, y1:-8, x2:10, y2:10},
				{x1:10, y1:10, x2:0, y2:18},
				{x1:0, y1:18, x2:-10, y2:10},
				{x1:-10, y1:10, x2:-13, y2:-8},
				{x1:-13, y1:-8, x2:-6, y2:-15}
			] 
		)
	}
}

class Skull3 extends Enemy {
	constructor(x, y) {
		super(
			'skull', x, y, 30, 0.08, 1, 45, 0.12, -1,
			[
				{x1:-6, y1:-15, x2:6, y2:-15},
				{x1:6, y1:-15, x2:13, y2:-8},
				{x1:13, y1:-8, x2:10, y2:10},
				{x1:10, y1:10, x2:0, y2:18},
				{x1:0, y1:18, x2:-10, y2:10},
				{x1:-10, y1:10, x2:-13, y2:-8},
				{x1:-13, y1:-8, x2:-6, y2:-15}
			] 
		)
	}
}

// Collision detection
function checkCollision(x, y, x1, y1, x2, y2) {
	let A = x - x1
	let B = y - y1
	let C = x2 - x1
	let D = y2 - y1

	let dot = A * C + B * D
	let len_sq = C * C + D * D
	let param = -1;
	if (len_sq != 0)
		param = dot / len_sq

	let xx, yy

	if (param < 0) {
		xx = x1
		yy = y1
	}
	else if (param > 1) {
		xx = x2
		yy = y2
	}
	else {
		xx = x1 + param * C
		yy = y1 + param * D
	}

	let dx = x - xx
	let dy = y - yy
	return Math.sqrt(dx * dx + dy * dy)
}

// Mouse/touch controls
let mouseDown = false
let mouseX = 128
let mouseY = 128
let targetX = 128
let targetY = 128

function setMousePosition(x, y) {
	let canvasHTML = canvas.getBoundingClientRect()
	mouseX = (x - canvasHTML.x) / canvasHTML.width * canvas.width
	mouseY = (y - canvasHTML.y) / canvasHTML.height * canvas.height
}

window.addEventListener('mousedown', ({x, y}) => {
	mouseDown = true
	let canvasHTML = canvas.getBoundingClientRect()
	mouseX = (x - canvasHTML.x) / canvasHTML.width * canvas.width
	mouseY = (y - canvasHTML.y) / canvasHTML.height * canvas.height
})

window.addEventListener('mousemove', ({x, y, buttons}) => {
	if (buttons != 1) return
	let canvasHTML = canvas.getBoundingClientRect()
	let positionX = (x - canvasHTML.x) / canvasHTML.width * canvas.width
	let positionY = (y - canvasHTML.y) / canvasHTML.height * canvas.height
	targetX += positionX - mouseX
	targetY += positionY - mouseY
	mouseX = positionX
	mouseY = positionY
})

window.addEventListener('mouseup', ({x, y, buttons}) => {
	mouseDown = false
})

window.addEventListener('touchstart', (event) => {
	event.preventDefault()
	mouseDown = true
	let canvasHTML = canvas.getBoundingClientRect()
	mouseX = (event.touches[0].clientX - canvasHTML.x) / canvasHTML.width * canvas.width
	mouseY = (event.touches[0].clientY - canvasHTML.y) / canvasHTML.height * canvas.height
}, {passive:false})

window.addEventListener('touchmove', (event) => {
	event.preventDefault()
	let canvasHTML = canvas.getBoundingClientRect()
	let positionX = (event.touches[0].clientX - canvasHTML.x) / canvasHTML.width * canvas.width
	let positionY = (event.touches[0].clientY - canvasHTML.y) / canvasHTML.height * canvas.height
	targetX += positionX - mouseX
	targetY += positionY - mouseY
	mouseX = positionX
	mouseY = positionY
}, {passive:false})

window.addEventListener('touchend', () => {
	mouseDown = false
})

// Level
let levelName
let level
let gameTime = 0

function loadLevel(name) {
	levelName = name
	level = levels[name]
	helicopter.x = level.spawnPointX
	helicopter.y = level.spawnPointY
	targetX = level.spawnPointX
	targetY = level.spawnPointY
	helicopter.dead = false
	previousTime = performance.now()
	window.requestAnimationFrame(frame)
}

// Frame events
let deltaTime = 0
let previousTime = 0
let collisions = []
let addCollisionPoints = false
let showCollisionPoints = false

function frame(currentTime) {
	if (!level) return

	// Time related variables
	deltaTime = (currentTime - previousTime) * 0.001
	previousTime = currentTime
	if (level != levels.end) gameTime += deltaTime

	// Enemies
	level.enemies.forEach(enemy => {
		let {originX, movementX, speedX, directionX, originY, movementY, speedY, directionY} = enemy
		if (enemy.movementX != 0){
			enemy.x = originX - movementX / 2 * directionX + directionX * Math.abs(movementX - currentTime * speedX % (movementX * 2))
		}
		if (enemy.movementY != 0){
			enemy.y = originY - movementY / 2 * directionY + directionY * Math.abs(movementY - currentTime * speedY % (movementY * 2))
		}
	})

	// Helicopter
	if (!helicopter.dead) {
		// Collisions
		collisions = []
		collisions.push(...level.collisionPoints)
		level.enemies.forEach(({x, y, collisionPoints}) => {
			collisionPoints.forEach(({x1, y1, x2, y2}) => {
				collisions.push({x1: x + x1, y1: y + y1, x2: x + x2, y2: y + y2})
			})
		})
		if (collisions.some(({x1,y1,x2,y2}) => checkCollision(helicopter.x, helicopter.y, x1, y1, x2, y2) < 8)) {
			helicopter.dead = true
			helicopter.explosionFrame = 1
			window.setTimeout(() => {
				loadLevel(levelName)
			}, 1000)
		}

		// Movement
		if (!addCollisionPoints){
			helicopter.x += (targetX - helicopter.x) * (1 - 0.25 ** deltaTime)
			helicopter.y += (targetY - helicopter.y) * (1 - 0.25 ** deltaTime)
		}

		// Animation
		helicopter.frame = currentTime * 0.04 % 4
	}

	// Target control
	if (!mouseDown){
		targetX += (helicopter.x - targetX) * (1 - 0.1 ** deltaTime)
		targetY += (helicopter.y - targetY) * (1 - 0.1 ** deltaTime)
	}

	targetX = Math.min(Math.max(-helicopter.x + 16, targetX), 512 - helicopter.x - 16)
	targetY = Math.min(Math.max(-helicopter.y + 16, targetY), 512 - helicopter.y - 16)	

	// Draw images on canvas
	drawBackground(level.background)
	draw(
		'arrow',
		level.endX + Math.cos((level.endAngle * Math.PI) / 180) * Math.abs(4 - currentTime * 0.01 % 8),
		level.endY + Math.sin((level.endAngle * Math.PI) / 180) * Math.abs(4 - currentTime * 0.01 % 8),
		level.endAngle
	)
	level.enemies.forEach(({sprite, x, y, originX, originY}) => {
		if (sprite === 'ball') {
			context.beginPath()
			context.moveTo(x, y - 4)
			context.quadraticCurveTo(originX, y - 32, originX, originY - 64)
			context.strokeStyle = '#fed'
			context.stroke()
		}
		draw(sprite, x, y)
	})
	if (level.image) draw(level.image, 128, 128,0, 256, 256)
	if (!helicopter.dead) draw(`helicopter${Math.floor(helicopter.frame)}`, helicopter.x, helicopter.y, (targetX - helicopter.x) * 0.25)
	else if (helicopter.explosionFrame < 8) {
		draw(`explosion${Math.floor(helicopter.explosionFrame)}`, helicopter.x, helicopter.y)
		helicopter.explosionFrame += 30 * deltaTime
	}

	if (showCollisionPoints) {
		context.strokeStyle = '#f28'
		collisions.forEach(({x1, y1, x2, y2}) => {
			context.beginPath()
			context.moveTo(x1, y1)
			context.lineTo(x2,y2)
			context.stroke()
		})
		context.strokeStyle = '#2f2'
		context.beginPath()
		context.arc(helicopter.x, helicopter.y, 8, 0, 6.2831)
		context.stroke()
	}

	context.fillStyle = '#eee'
	context.font = '12px Sans-serif'
	context.fillText(Math.floor(gameTime * 100) / 100, 120, 13)
	if (level === levels.end) {
		context.fillText('Congratulations!', 84, 28)
		context.fillStyle = '#eee4'
		context.fillText('Made by Lobo', 3, 252)
	}

	// End level
	let distanceFromEnd = Math.sqrt((level.endX - helicopter.x) ** 2 + (level.endY - helicopter.y) ** 2)
	if (distanceFromEnd < 16) {
		if (level === levels.end) gameTime = 0
		loadLevel(level.nextLevel)
	}

	// Call next frame
	window.requestAnimationFrame(frame)
}

// Add collisions
window.addEventListener('mousedown', () => {
	if (!addCollisionPoints) return
	level.collisionPoints.push(
		{
			x1: Math.round(mouseX),
			y1: Math.round(mouseY),
			x2: Math.round(mouseX),
			y2: Math.round(mouseY)
		}
	)
})
window.addEventListener('mouseup', () => {
	if (!addCollisionPoints) return
	level.collisionPoints[level.collisionPoints.length-1].x2 = Math.round(mouseX)
	level.collisionPoints[level.collisionPoints.length-1].y2 = Math.round(mouseY)
})

let levels = {
	level1: {
		image: 'level1',
		background: 'sky',
		spawnPointX: 40,
		spawnPointY: 40,
		endX: 232,
		endY: 230,
		endAngle: 0,
		nextLevel: 'level2',
		enemies: [],
		collisionPoints: [
			{x1:0, y1:110, x2:81, y2:110},
			{x1:81, y1:110, x2:80, y2:256},
			{x1:147, y1:0, x2:118, y2:17},
			{x1:118, y1:17, x2:116, y2:57},
			{x1:116, y1:57, x2:174, y2:93},
			{x1:174, y1:93, x2:223, y2:84},
			{x1:223, y1:84, x2:256, y2:93}
		]
	},
	level2: {
		image: 'level2',
		background: 'sky',
		spawnPointX: 24,
		spawnPointY: 220,
		endX: 240,
		endY: 24,
		endAngle: 325,
		nextLevel: 'level3',
		enemies: [],
		collisionPoints: [
			{x1:0, y1:122, x2:16, y2:62},
			{x1:16, y1:62, x2:32, y2:72},
			{x1:32, y1:72, x2:105, y2:52},
			{x1:105, y1:52, x2:124, y2:58},
			{x1:124, y1:58, x2:128, y2:74},
			{x1:128, y1:74, x2:145, y2:86},
			{x1:145, y1:86, x2:181, y2:82},
			{x1:181, y1:82, x2:201, y2:62},
			{x1:201, y1:62, x2:212, y2:0},
			{x1:0, y1:248, x2:102, y2:250},
			{x1:102, y1:250, x2:109, y2:239},
			{x1:109, y1:239, x2:109, y2:224},
			{x1:109, y1:224, x2:60, y2:202},
			{x1:60, y1:202, x2:55, y2:187},
			{x1:55, y1:187, x2:55, y2:157},
			{x1:55, y1:157, x2:89, y2:123},
			{x1:89, y1:123, x2:126, y2:118},
			{x1:126, y1:118, x2:159, y2:125},
			{x1:159, y1:125, x2:183, y2:145},
			{x1:183, y1:145, x2:227, y2:104},
			{x1:227, y1:104, x2:256, y2:94}
		]
	},
	level3: {
		image: 'level3',
		background: 'sky',
		spawnPointX: 50,
		spawnPointY: 235,
		endX: 240,
		endY: 48,
		endAngle: 0,
		nextLevel: 'level4',
		enemies: [
			new Snake(150,84)
		],
		collisionPoints: [
			{x1:13, y1:256, x2:21, y2:113},
			{x1:21, y1:113, x2:35, y2:103},
			{x1:35, y1:103, x2:39, y2:50},
			{x1:39, y1:50, x2:10, y2:-1},
			{x1:99, y1:256, x2:82, y2:231},
			{x1:82, y1:231, x2:89, y2:206},
			{x1:89, y1:206, x2:102, y2:196},
			{x1:102, y1:196, x2:103, y2:155},
			{x1:103, y1:155, x2:68, y2:128},
			{x1:68, y1:128, x2:69, y2:110},
			{x1:69, y1:110, x2:93, y2:93},
			{x1:93, y1:93, x2:129, y2:97},
			{x1:129, y1:97, x2:154, y2:81},
			{x1:154, y1:81, x2:235, y2:89},
			{x1:235, y1:89, x2:256, y2:103}
		]
	},
	level4: {
		image: 'level4',
		background: 'sunset',
		spawnPointX: 24,
		spawnPointY: 128,
		endX: 240,
		endY: 86,
		endAngle: 0,
		nextLevel: 'level5',
		enemies: [],
		collisionPoints: [
			{x1:1, y1:27, x2:19, y2:21},
			{x1:19, y1:21, x2:31, y2:28},
			{x1:31, y1:28, x2:78, y2:32},
			{x1:78, y1:32, x2:114, y2:-1},
			{x1:133, y1:-1, x2:133, y2:17},
			{x1:133, y1:17, x2:142, y2:45},
			{x1:142, y1:45, x2:149, y2:45},
			{x1:149, y1:45, x2:151, y2:174},
			{x1:151, y1:174, x2:168, y2:175},
			{x1:168, y1:175, x2:170, y2:46},
			{x1:170, y1:46, x2:188, y2:45},
			{x1:188, y1:45, x2:195, y2:58},
			{x1:195, y1:58, x2:257, y2:57},
			{x1:0, y1:185, x2:42, y2:188},
			{x1:42, y1:188, x2:113, y2:233},
			{x1:113, y1:233, x2:239, y2:223},
			{x1:239, y1:223, x2:239, y2:129},
			{x1:239, y1:129, x2:205, y2:129},
			{x1:205, y1:129, x2:204, y2:111},
			{x1:204, y1:111, x2:256, y2:111}
		]
	},
	level5: {
		image: 'level5',
		background: 'sunset',
		spawnPointX: 24,
		spawnPointY: 230,
		endX: 128,
		endY: 24,
		endAngle: 270,
		nextLevel: 'level6',
		enemies: [],
		collisionPoints: [
			{x1:124, y1:257, x2:200, y2:179},
			{x1:200, y1:179, x2:211, y2:147},
			{x1:211, y1:147, x2:210, y2:113},
			{x1:210, y1:113, x2:189, y2:112},
			{x1:189, y1:112, x2:91, y2:136},
			{x1:91, y1:136, x2:88, y2:119},
			{x1:88, y1:119, x2:184, y2:95},
			{x1:184, y1:95, x2:215, y2:94},
			{x1:215, y1:94, x2:214, y2:-2},
			{x1:0, y1:195, x2:22, y2:195},
			{x1:22, y1:195, x2:23, y2:183},
			{x1:23, y1:183, x2:157, y2:183},
			{x1:157, y1:183, x2:156, y2:164},
			{x1:156, y1:164, x2:42, y2:163},
			{x1:42, y1:163, x2:59, y2:141},
			{x1:59, y1:141, x2:57, y2:120},
			{x1:57, y1:120, x2:33, y2:103},
			{x1:33, y1:103, x2:33, y2:75},
			{x1:33, y1:75, x2:151, y2:75},
			{x1:151, y1:75, x2:151, y2:58},
			{x1:151, y1:58, x2:34, y2:56},
			{x1:34, y1:56, x2:33, y2:0}
		]
	},
	level6: {
		image: 'level6',
		background: 'sunset',
		spawnPointX: 120,
		spawnPointY: 240,
		endX: 240,
		endY: 48,
		endAngle: 35,
		nextLevel: 'level7',
		enemies: [
			new Ball(84, 168),
			new Ball2(143, 116),
			new Ball(124, 20)
		],
		collisionPoints: [
			{x1:65, y1:0, x2:65, y2:48},
			{x1:65, y1:48, x2:28, y2:64},
			{x1:28, y1:64, x2:-2, y2:111},
			{x1:-1, y1:136, x2:64, y2:101},
			{x1:64, y1:101, x2:84, y2:101},
			{x1:84, y1:101, x2:74, y2:118},
			{x1:74, y1:118, x2:-1, y2:163},
			{x1:0, y1:203, x2:57, y2:203},
			{x1:57, y1:203, x2:56, y2:221},
			{x1:57, y1:221, x2:41, y2:221},
			{x1:41, y1:221, x2:41, y2:256},
			{x1:190, y1:256, x2:190, y2:230},
			{x1:190, y1:230, x2:179, y2:227},
			{x1:179, y1:227, x2:178, y2:195},
			{x1:178, y1:195, x2:181, y2:184},
			{x1:181, y1:184, x2:140, y2:183},
			{x1:141, y1:183, x2:141, y2:165},
			{x1:141, y1:165, x2:180, y2:165},
			{x1:180, y1:165, x2:178, y2:147},
			{x1:178, y1:147, x2:256, y2:146},
			{x1:256, y1:127, x2:153, y2:66},
			{x1:153, y1:66, x2:142, y2:48},
			{x1:142, y1:48, x2:161, y2:47},
			{x1:161, y1:47, x2:256, y2:100}
		]

	},
	level7: {
		image: 'level7',
		background: 'night',
		spawnPointX: 90,
		spawnPointY: 24,
		endX: 240,
		endY: 186,
		endAngle: 0,
		nextLevel: 'level8',
		enemies: [
			new Skull(122, 130)
		],
		collisionPoints: [
			{x1:59, y1:1, x2:60, y2:185},
			{x1:60, y1:185, x2:118, y2:192},
			{x1:118, y1:192, x2:194, y2:215},
			{x1:194, y1:215, x2:228, y2:221},
			{x1:228, y1:221, x2:256, y2:217},
			{x1:127, y1:1, x2:143, y2:43},
			{x1:143, y1:43, x2:146, y2:65},
			{x1:146, y1:65, x2:169, y2:84},
			{x1:169, y1:84, x2:172, y2:106},
			{x1:172, y1:106, x2:180, y2:113},
			{x1:180, y1:113, x2:217, y2:117},
			{x1:217, y1:117, x2:231, y2:113},
			{x1:231, y1:113, x2:233, y2:148},
			{x1:233, y1:148, x2:256, y2:153},
			{x1:60, y1:78, x2:79, y2:79},
			{x1:79, y1:79, x2:100, y2:95},
			{x1:100, y1:95, x2:83, y2:98},
			{x1:83, y1:98, x2:66, y2:95}
		]


	},
	level8: {
		image: 'level8',
		background: 'night',
		spawnPointX: 20,
		spawnPointY: 170,
		endX: 240,
		endY: 200,
		endAngle: 0,
		nextLevel: 'end',
		enemies: [
			new Skull2(80, 123),
			new Skull3(188, 118)
		],
		collisionPoints: [
			{x1:0, y1:34, x2:46, y2:31},
			{x1:46, y1:31, x2:89, y2:80},
			{x1:89, y1:80, x2:107, y2:90},
			{x1:107, y1:90, x2:119, y2:109},
			{x1:118, y1:109, x2:135, y2:111},
			{x1:135, y1:111, x2:149, y2:103},
			{x1:149, y1:103, x2:171, y2:74},
			{x1:171, y1:74, x2:208, y2:77},
			{x1:208, y1:77, x2:256, y2:34},
			{x1:0, y1:204, x2:43, y2:203},
			{x1:43, y1:203, x2:45, y2:185},
			{x1:45, y1:185, x2:59, y2:175},
			{x1:59, y1:175, x2:74, y2:179},
			{x1:74, y1:179, x2:86, y2:196},
			{x1:86, y1:196, x2:98, y2:172},
			{x1:98, y1:172, x2:133, y2:144},
			{x1:133, y1:144, x2:171, y2:166},
			{x1:171, y1:166, x2:185, y2:219},
			{x1:185, y1:219, x2:222, y2:231},
			{x1:222, y1:231, x2:257, y2:233}
		]

	},
	end: {
		background: 'night2',
		spawnPointX: 32,
		spawnPointY: 128,
		endX: 240,
		endY: 128,
		endAngle: 0,
		nextLevel: 'level1',
		enemies: [],
		collisionPoints: []
	}
}

// First level
loadLevel('level1')
