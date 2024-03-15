import { IsNumber } from "class-validator";

export enum Cards {
    CloverA,
    DiamondA,
    HeartA,
    SpadeA,

    CloverKing,
    DiamondKing,

    CloverQueen,
    DiamondQueen,
    HeartQueen,
    SpadeQueen,

    Clover10,
    Diamond10,
    Heart10,
    Spade10,
}

export class RevealCardDto {
    @IsNumber()
    cardIndex: Cards;
}