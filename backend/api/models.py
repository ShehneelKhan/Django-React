from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_stock = models.IntegerField()
    selected = models.BooleanField(default=False)

    def __str__(self):
        return self.name
