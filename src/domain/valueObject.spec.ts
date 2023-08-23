import { ValueObject } from "./valueObject";

// Let's create a simple class extending ValueObject for testing.
class Point extends ValueObject<Point> {
	constructor(public x: number, public y: number) {
		super(Point, ["x", "y"]);
	}

	public update(updatedProps: Partial<Point>): Point {
		return this.newInstanceWith(updatedProps);
	}
}

describe("ValueObject", () => {
	it("should create a new instance with updated properties", () => {
		const point1 = new Point(10, 20);
		const point2 = point1.update({ x: 30 });

		expect(point2.x).toEqual(30);
		expect(point2.y).toEqual(20);
	});

	it("should compare two ValueObjects correctly", () => {
		const point1 = new Point(10, 20);
		const point2 = new Point(10, 20);
		const point3 = new Point(30, 20);

		expect(point1.equals(point2)).toEqual(true);
		expect(point1.equals(point3)).toEqual(false);
	});
});
