#pragma once
class Player{
public:
	const int MAX_SPEED = 2;
	bool moving = false;

	int x, y, direction, speed = 0, acceleration = 5, friction = 7;
	Player(int x, int y);
	Player();
	~Player();
	void setDirection(int direction);
	void step(bool moving, float direction = -1);

};

