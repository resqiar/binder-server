package main

import "github.com/gofiber/fiber/v2"
import "binder-server/services"

func main() {
	app := fiber.New()

	app.Get("/", services.HelloWorld)

	app.Listen(":5000")
}
