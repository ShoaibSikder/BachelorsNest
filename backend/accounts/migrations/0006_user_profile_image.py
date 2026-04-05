from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, null=True, upload_to='profile_images/'),
        ),
    ]
