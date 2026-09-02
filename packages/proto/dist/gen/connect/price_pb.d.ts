import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { LatLng } from "./common_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file price.proto.
 */
export declare const file_price: GenFile;
/**
 * @generated from message goto.v1.GetPriceRequest
 */
export type GetPriceRequest = Message<"goto.v1.GetPriceRequest"> & {
    /**
     * @generated from field: goto.v1.LatLng origin = 1;
     */
    origin?: LatLng | undefined;
    /**
     * @generated from field: goto.v1.LatLng destination = 2;
     */
    destination?: LatLng | undefined;
};
/**
 * Describes the message goto.v1.GetPriceRequest.
 * Use `create(GetPriceRequestSchema)` to create a new message.
 */
export declare const GetPriceRequestSchema: GenMessage<GetPriceRequest>;
/**
 * @generated from message goto.v1.GetPriceResponse
 */
export type GetPriceResponse = Message<"goto.v1.GetPriceResponse"> & {
    /**
     * @generated from field: double price = 1;
     */
    price: number;
    /**
     * @generated from field: string currency = 2;
     */
    currency: string;
};
/**
 * Describes the message goto.v1.GetPriceResponse.
 * Use `create(GetPriceResponseSchema)` to create a new message.
 */
export declare const GetPriceResponseSchema: GenMessage<GetPriceResponse>;
/**
 * @generated from service goto.v1.PriceService
 */
export declare const PriceService: GenService<{
    /**
     * @generated from rpc goto.v1.PriceService.GetPrice
     */
    getPrice: {
        methodKind: "unary";
        input: typeof GetPriceRequestSchema;
        output: typeof GetPriceResponseSchema;
    };
}>;
//# sourceMappingURL=price_pb.d.ts.map