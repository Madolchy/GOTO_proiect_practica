import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PRICE_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'goto.v1',
                    protoPath: require.resolve('@goto/proto/proto/price.proto'),
                    url: 'localhost:5200',
                },
            },
        ]),
    ],
    controllers: [PriceController],
    providers: [PriceService],
})
export class PriceModule {}
