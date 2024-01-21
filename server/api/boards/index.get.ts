import { Board } from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const boards = await Board.find({
        owner: user._id,
    });

    return boards;
});
