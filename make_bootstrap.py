import os
import sys
import shutil

def replace_and_copy_py(file_input,file_output,app_name,proj_name):
    #input file
    fin = open(file_input, "rt")
    #output file to write the result to
    fout = open(file_output, "w")
    #for each line in the input file
    for line in fin:
        #read replace the string and write to output file
        ln = line.replace('#application#', app_name)
        ln = ln.replace('#project#', proj_name)
        fout.write(ln)
    #close input and output files
    fin.close()
    fout.close()

def main(proj_name,app_name):
    dir_bootstrap_src = 'bootstrap_src'
    dir_app_template = os.path.join('templates',app_name)
    file_setting = os.path.join(dir_bootstrap_src,'settings.py.template')
    file_proj_url = os.path.join(dir_bootstrap_src,'urls.py.proj.template')
    file_app_url = os.path.join(dir_bootstrap_src,'urls.py.app.template')
    file_views = os.path.join(dir_bootstrap_src,'views.py.template')
    replace_and_copy_py(file_setting, os.path.join(proj_name,'settings.py'),app_name,proj_name)
    replace_and_copy_py(file_proj_url, os.path.join(proj_name,'urls.py'),app_name,proj_name)                   
    replace_and_copy_py(file_app_url, os.path.join(app_name,'urls.py'),app_name,proj_name)
    replace_and_copy_py(file_views, os.path.join(app_name,'views.py'),app_name,proj_name)
    if not(os.path.exists(dir_app_template)):
        os.mkdir(dir_app_template)
    shutil.copyfile(os.path.join(dir_bootstrap_src,'main.html.template'), os.path.join(dir_app_template,'main.html'))

args = sys.argv
print(args)
if len(args) <3:
    print('Argument 1 should be project name')
    print('Argument 2 should be application name')
else:
    main(args[1],args[2])

    