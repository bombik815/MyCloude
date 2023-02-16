
import os
from base.models import File_tb
from base.serializers import FileSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import FileResponse, HttpResponse

dict_type = {'.doc': 'application/msword',
             '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
             '.dot': 'application/msword',
             '.dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
             '.docm': 'application/vnd.ms-word.document.macroEnabled.12',
             '.dotm': 'application/vnd.ms-word.template.macroEnabled.12',
             '.xls': 'application/vnd.ms-excel', '.xla': 'application/vnd.ms-excel',
             '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
             '.xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
             '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
             '.xltm': 'application/vnd.ms-excel.template.macroEnabled.12',
             '.xlam': 'application/vnd.ms-excel.addin.macroEnabled.12',
             '.xlsb': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
             '.ppt': 'application/vnd.ms-powerpoint',
             '.pot': 'application/vnd.ms-powerpoint', '.pps': 'application/vnd.ms-powerpoint',
             '.ppa': 'application/vnd.ms-powerpoint',
             '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
             '.potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
             '.ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
             '.ppam': 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
             '.pptm': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
             '.potm': 'application/vnd.ms-powerpoint.template.macroEnabled.12',
             '.ppsm': 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
             '.mdb': 'application/vnd.ms-access', '.pdf': 'application/pdf',
             '.jpeg ': 'mage/jpeg', '.jpg ': 'mage/jpg', '.png': 'mage/png', '.json':'application/json',
             '.csv': 'text/csv',	'.css': 'text/css', '.txt': 'text/plain','.svg': 'mage/svg+xml',
             '.tiff': 'text/csv', '.tif': 'text/csv',
             }

@api_view(['GET'])
@permission_classes([AllowAny])
def download_share(request, pk, **kwargs):
    
    try:
        files = File_tb.objects.get(id_uuid=pk)
        filepath = files.file_file.path
        file_type = f".{files.file_type}"
        
        for i in dict_type:
            if i == file_type:
                file_type = dict_type[i]
                break
        
        if os.path.exists(filepath):
            with open(filepath, 'rb') as fl:
                response = HttpResponse(fl.read(), 
                                        content_type=file_type, 
                                        charset='utf-8')
                response['Content-Disposition'] = 'attachment; filename={0}'.format(files.file_name)
                return response
      
    except File_tb.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download(request, pk):
    try:
        files = File_tb.objects.get(id=pk)
        filename = files.file_file.path
        if os.path.exists(filename):
            response = FileResponse(open(filename, 'rb'))
            return response
    except File_tb.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyFiles (request):
    user = request.user   
    files = File_tb.objects.filter(user_id=user.id).order_by('-create_at')
    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def FileList(request, pk):
    try:
        files = File_tb.objects.filter(user_id=pk).order_by('-create_at')
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)
    except File_tb.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def FileDetail(request, pk):
    try:
        files = File_tb.objects.get(id=pk)
        serilizer = FileSerializer(files, many=False)
        return Response(serilizer.data)
    except File_tb.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateFile(request, *args, **kwargs):
    
    user = request.user 
    data = request.data 
    file_ = request.FILES['file_file']

    files = File_tb.objects.create(
            user_id=user,
            file_file= request.FILES['file_file'],
            file_name=data['file_name'],
            description=data['description'],
            size_file=data['size_file'],
            create_at=data['create_at'],
            file_type=data['file_type']
        )
    
    serializer = FileSerializer(files, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def EditFile(request, pk):
    files = File_tb.objects.get(id=pk)
    serilizer = FileSerializer(instance=files, data=request.data)
    if serilizer.is_valid():
        serilizer.save()
        return Response({'detail':'The File was updated successfully!'}, status=status.HTTP_200_OK)
    return Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)
  


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteFile(request, pk):
    product = File_tb.objects.get(id=pk)
    product.delete()
    return Response({'detail':'The File delete successfully!'},
                    status=status.HTTP_200_OK)

