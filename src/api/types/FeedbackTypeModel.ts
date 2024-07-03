/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface FeedbackTypeModel {
    /** The type of feedback. The default feedback types available are 'rating', 'action', 'issue', 'correction', and 'comment'. */
    type: Humanloop.FeedbackTypeModelType;
    /** The allowed values for categorical feedback types. Not populated for `correction` and `comment`. */
    values?: Humanloop.CategoricalFeedbackLabel[];
}
