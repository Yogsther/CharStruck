
#include "Player.h"
#include <iostream>
#include <vector>
#include <math.h>

double PI = 3.141592653589793238463;

using namespace std;

Player::Player(int x, int y) {
	this->x = x;
	this->y = y;
}
Player::Player() {

}

Player::~Player() {
	std::cout << "Player was destoryed" << std::endl;
}

void Player::setDirection(int direction){
	this->direction = direction;
}

void Player::step(bool moving, float direciton) {
	
	// Calculate new speed
	if (moving) {
		this->speed += this->acceleration;
		if (this->speed > this->MAX_SPEED) this->speed = this->MAX_SPEED;
	} else {
		this->speed -= this->friction;
		if (this->speed < 0) this->speed = 0;
	}

	// Move

	if (direciton >= 0) this->direction = direciton;
	this->x += cos((this->direction + 90) / (180 / PI)) * this->speed;
	this->y += sin((this->direction + 90) / (180 / PI)) * this->speed;

}