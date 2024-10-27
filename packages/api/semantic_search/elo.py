from enum import Enum

class Outcome(Enum):
	WIN = 1
	LOSS = 0
	TIE = 0.5
	BOTH_BAD = -0.5

class Model:
	def __init__(self, name: str, elo=0, k=32):
		self.name = name
		self.elo = elo
		self.k = k

	def __repr__(self):
		return f'{self.name}: {self.elo}'

	def update(self, other, outcome: Outcome) -> float:
		if (outcome == Outcome.BOTH_BAD):
			if self.elo > other.elo:
				self.elo -= self.k / 2
				other.elo -= self.k / 4
			else:
				self.elo -= self.k / 4
				other.elo -= self.k / 2

			return self.elo

		expected = 1 / (1 + 10 ** ((other.elo - self.elo) / 400))

		self.elo += self.k * (outcome.value - expected)
		other.elo += self.k * (expected - outcome.value)

		return self.elo
