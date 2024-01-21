import { Validator } from "#nuxt-server-utils";
import BoardSchema from "~/schemas/Board.schema";
import { Board } from "~/server/models/Board.model";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const body = await readBody(event);

    Validator.validateSchema(BoardSchema.partial(), body);

    const boardId = getRouterParam(event, "boardId");
    const board = await Board.findOneAndUpdate(
        {
            owner: user._id,
            _id: boardId,
        },
        {
            $set: body,
        }
    );

    return board;
});
