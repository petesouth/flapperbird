# apt-get upgrade
# apt-get update
# apt-get install python
# apt-get install python-pip
# apt-get install python3-venv
# apt-get install libmysqlclient-dev
# apt-get install python-mysqldb



# sudo apt-get install python python3 python-pip python3-pip python-dev python3-dev python-mysqldb python3-mysqldb mysql-server  libmysqlclient-dev



# Make sure python3 3.86 is installed python --version
#Should output
#                :>Python 3.6.8

#  https://www.django-rest-framework.org/tutorial/quickstart/

# python3 manage.py createsuperuser --email admin@example.com --username admin

# python3 manage.py makemigrations
# python3 manage.py migrate

# ilm-server-2/issara/settings.py  Contains the DB settings

# Create a virtual environment to isolate our package dependencies locally

python3 -m venv env

# Note.. So this each time your running the app so it finds the local project pip installed
# Enf python modules.
source env/bin/activate  # On Windows use `env\Scripts\activate`

# Install Django and Django REST framework into the virtual environment
#pip install wheel
#pip install django
#pip install djangorestframework
#pip install mysqlclient


sudo apt-get install python-dev python3-dev
sudo apt-get install libmysqlclient-dev
pip install pymysql
pip install mysqlclien

pip install django djangorestframework mysqlclient djangorestframework_simplejwt django-cors-headers

# Set up a new project with a single application
django-admin startproject issara .  # Note the trailing '.' character
cd issara
django-admin startapp ilm_server_2
cd ..

python3 manage.py migrate