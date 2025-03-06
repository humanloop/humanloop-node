/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ImageUrl } from "./ImageUrl";

export const ImageChatContent: core.serialization.ObjectSchema<
    serializers.ImageChatContent.Raw,
    Humanloop.ImageChatContent
> = core.serialization.object({
    type: core.serialization.stringLiteral("image_url"),
    imageUrl: core.serialization.property("image_url", ImageUrl),
});

export declare namespace ImageChatContent {
    export interface Raw {
        type: "image_url";
        image_url: ImageUrl.Raw;
    }
}
