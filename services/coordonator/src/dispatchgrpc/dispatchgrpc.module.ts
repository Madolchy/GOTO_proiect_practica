import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DispatchGrpcService } from './dispatchgrpc.service';
import { DispatchSSEModule } from '../dispatchsse/dispatchsse.module';

@Module({
    imports: [
        DispatchSSEModule,
        ClientsModule.registerAsync([
            {
                name: 'DISPATCH_GRPC',
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'goto.v1',
                        protoPath: require.resolve('@goto/proto/proto/driver_location.proto'),
                        url: config.getOrThrow<string>('DISPATCH_GRPC_URL'),
                        loader: {
                            arrays: true,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [DispatchGrpcService],
    exports: [DispatchGrpcService],
})
export class DispatchGrpcModule {}
