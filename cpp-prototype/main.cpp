
#include <SDL.h>
#include <SDL_image.h>

#include "Player.h"
#include <iostream>
#include <vector>

using namespace std;

#define WIDTH 800
#define HEIGHT 600
#define PLAYER_SPRITE "textures/creature.png"
#define PARTICLE_SPRITE "textures/particle.png"

Player player = Player(0, 0);

vector<int> directions;
vector<int> keysDown;

bool keyDown(int keyCode) {
	vector<int>::iterator it = find(keysDown.begin(), keysDown.end(), keyCode);
	return it != keysDown.end();
}

int main(int argc, char* argv[]) {


	SDL_Window* window = NULL;
	SDL_Renderer* renderer = NULL;
	SDL_Texture* img = NULL;
	int w, h; 


	if (SDL_Init(SDL_INIT_VIDEO) < 0)
		return 1;

	window = SDL_CreateWindow("SDL Game testing", 100, 100, WIDTH, HEIGHT, 0);
	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);


	img = IMG_LoadTexture(renderer, PLAYER_SPRITE);

	SDL_QueryTexture(img, NULL, NULL, &w, &h); 

	SDL_Rect texr; texr.x = 0; texr.y = 0; texr.w = 50; texr.h = 50;

	

	

	while (true) {

	
		SDL_Event e;
		
		if (SDL_PollEvent(&e)) {
	
			if (e.type == SDL_QUIT)
				break;
			else if (e.type == SDL_KEYUP && e.key.keysym.sym == SDLK_ESCAPE)
				break;
			
			if (e.type == SDL_KEYDOWN) {
				vector<int>::iterator it = find(keysDown.begin(), keysDown.end(), e.key.keysym.sym);
				if (it == keysDown.end()) keysDown.push_back(e.key.keysym.sym);
			}

			if (e.type == SDL_KEYUP) {
				vector<int>::iterator it = find(keysDown.begin(), keysDown.end(), e.key.keysym.sym);
				if (it != keysDown.end()) {
					int index = distance(keysDown.begin(), it);
					keysDown.erase(keysDown.begin() + index);
				}
			}


			
		}


		// Get desired moving direction from user
		if (keysDown.size() > 0) {
			if (keyDown(SDLK_w)) directions.push_back(180);
			if (keyDown(SDLK_s)) directions.push_back(0);
			if (keyDown(SDLK_a)) directions.push_back(90);
			if (keyDown(SDLK_d)) directions.push_back(270);
		}

		if (directions.size() > 0) {
			cout << directions.size() << endl;

			float calculatedDirection;
			int sumDirections = 0;
			for (int direction : directions) {
				sumDirections += direction;
			}

			// Edge case if the player is pressing (S + D), move to towards bottom right corner
			// Adding 0 + 270 and then deviding them with 2 does not result in the right direction.
			if (directions.size() == 1) calculatedDirection = directions.at(0);
			else if (keyDown(SDLK_s) && keyDown(SDLK_d)) calculatedDirection = 315;
			else calculatedDirection = sumDirections / directions.size();

			// Move player
			player.step(true, calculatedDirection);

			// Clear directions array
			while (!directions.empty()) directions.pop_back();
		}
		else {
			// Slow down player, no input from user
			player.step(false);
		}
		

		// Move player
		texr.x = player.x;
		texr.y = player.y;

	
		SDL_RenderClear(renderer);
		SDL_RenderCopy(renderer, img, NULL, &texr);
		SDL_RenderPresent(renderer);
	}

	SDL_DestroyTexture(img);
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);

	return 0;
}