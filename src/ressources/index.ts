import { ModelCallMetadata } from "modelfusion";

export interface Response {
	value: string;
	response: {
		[k: string]: unknown;
		done: boolean;
		context: number[];
	};
	metadata: ModelCallMetadata;
}