const createGrid = state => {
	const { columns, rows, tilesize } = state;

	const cells = [];
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			cells.push({
				x,
				y,
				alive: !Math.floor(Math.random() * 5),
			});
		}
	}

	return {columns, rows, tilesize, cells};
};

const initCanvas = state => {
	const { columns, rows, tilesize } = state;

	const canvas = document.querySelector(".game");
	const ctx = canvas.getContext("2d");
	canvas.setAttribute("width", columns * tilesize);
	canvas.setAttribute("height", rows * tilesize);

	return (state => {
		const { tilesize, columns, rows, cells } = state;
	
		ctx.clearRect(0, 0, columns * tilesize, rows * tilesize);
		cells.forEach(cell => {
			const { x, y, alive } = cell;
			ctx.fillStyle = (alive) ? '#000' : '#fff';
			ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);
			ctx.strokeRect(x * tilesize, y * tilesize, tilesize, tilesize);
		});
	});
};

const isAlive = (state, x, y) => {
	const { columns, rows, cells } = state;
	return x >= 0 && x < columns && y >= 0 && y < rows && cells[y * columns + x].alive;
};

const countAliveNeighbours = (state, cell) => {
	const { x, y } = cell;
	return isAlive(state, x - 1, y) + isAlive(state, x + 1, y)
	+ isAlive(state, x, y - 1) + isAlive(state, x, y + 1)
	+ isAlive(state, x - 1, y - 1) + isAlive(state, x + 1, y - 1)
	+ isAlive(state, x - 1, y + 1) + isAlive(state, x + 1, y + 1);
};

const update = state => {
	const cells = state.cells.map(cell => {
		const neighbours = countAliveNeighbours(state, cell);
		const alive = (cell.alive) ? (neighbours === 2 || neighbours === 3) : neighbours === 3;
		return { ...cell, alive };
	});

	return { ...state, cells };
};

const step = state => {
	const updatedState = update(state);
	draw(updatedState);
	setTimeout(() => step(updatedState), 250);
};

// Process
const initialState = createGrid({
	columns: 30,
	rows: 15,
	tilesize: 48,
});

const draw = initCanvas(initialState);
step(initialState);
