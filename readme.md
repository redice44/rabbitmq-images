Passes a buffer via RabbitMQ from the producer to the consumer.

Place an image in `./producer/src` and make sure the producer's `imageFileSource` resolves to that image or whatever else you want to send. I tested it with a 2.7mb png and had no issues.

When you run the producer, the consumer will take the buffer off of the broker and write it to where ever `outputFile` points to. 

Run RabbitMQ and the consumer
`docker-compose up -d consumer && docker-compose logs -f`

Run the Producer to send an image
`docker-compose run --rm producer npm start`
