import { Socket } from 'socket.io';
import { Cards } from '../utils/Cards';
import { CardStateDefinition } from '../utils/types';

export class CardState {
  constructor(
    public readonly card: Cards,
    public isRevealed: boolean = false,
    public isLocked: boolean = false,
    public ownerId: Socket['id'] | null = null,
  ) { }

  public toDefinition(): CardStateDefinition {
    return {
      card: this.isRevealed ? this.card : null,
      owner: this.ownerId,
    };
  }
}