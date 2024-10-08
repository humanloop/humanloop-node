/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface ImageUrl {
    /** Either a URL of the image or the base64 encoded image data. */
    url: string;
    /** Specify the detail level of the image provided to the model. For more details see: https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding */
    detail?: Humanloop.ImageUrlDetail;
}
