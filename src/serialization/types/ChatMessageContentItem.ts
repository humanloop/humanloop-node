/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { TextChatContent } from "./TextChatContent";
import { ImageChatContent } from "./ImageChatContent";

export const ChatMessageContentItem: core.serialization.Schema<
    serializers.ChatMessageContentItem.Raw,
    Humanloop.ChatMessageContentItem
> = core.serialization.undiscriminatedUnion([TextChatContent, ImageChatContent]);

export declare namespace ChatMessageContentItem {
    export type Raw = TextChatContent.Raw | ImageChatContent.Raw;
}
