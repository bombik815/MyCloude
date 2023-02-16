from django.urls import path
# from base.views.files_views import FileDetail, CreateFile, EditFile, DeleteFile
from base.views import files_views as views

app_name = 'base'

urlpatterns = [
     path('', views.getMyFiles, name = 'listfiles'),
     path('user/<int:pk>/', views.FileList, name = 'filelistuser'),
     path('<int:pk>/', views.FileDetail, name = 'detailfile'),
     path('download/<int:pk>/', views.download, name = 'download'),
     path('download/<uuid:pk>/', views.download_share, name = 'download_share'),
     path('create/', views.CreateFile, name = 'createfile'),
     path('edit/<int:pk>/', views.EditFile, name = 'editfile'),
     path('delete/<int:pk>/', views.DeleteFile, name = 'deletelfile'),
]
