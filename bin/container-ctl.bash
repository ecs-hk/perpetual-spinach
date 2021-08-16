#!/bin/bash

set -u
set -o pipefail

# -------------------------------------------------------------------------- #
#                       VARIABLE DEFINITION
# -------------------------------------------------------------------------- #

readonly _env_file='.env'
readonly _tag='perpetual-spinach:latest'
readonly _container_name='perpetual_spinach'

readonly _arg="${1:-x}"

# -------------------------------------------------------------------------- #
#                       FUNCTIONS
# -------------------------------------------------------------------------- #

errout() {
        local _msg="${0##*/} error: ${1}"
        printf '%s\n' "${_msg}"
        exit 1
}

set_docker_cmd() {
        local _docker_rc
        local _podman_rc

        which docker >/dev/null 2>&1
        _docker_rc=${?}

        which podman >/dev/null 2>&1
        _podman_rc=${?}

        # Tests in this order favor docker if it's found.
        if [ ${_docker_rc} -eq 0 ] ; then
                _command='docker'
        elif [ ${_podman_rc} -eq 0 ] ; then
                _command='podman'
        fi

        if [ "${_command:-x}" == "x" ] ; then
                errout 'No Docker-compatible command found in PATH'
        fi

        readonly _cmd="${_command}"
}

source_in_env() {
        . "${_env_file}" >/dev/null 2>&1

        if [ ${?} -ne 0 ] ; then
                errout "Unable to source in ${_env_file}"
        fi
}

kill_previous_container() {
        "${_cmd}" ps -a 2>/dev/null |
        grep -Eq "\<${_container_name}\>"

        if [ ${?} -ne 0 ] ; then
                return
        fi

        "${_cmd}" 'stop' "${_container_name}" >/dev/null 2>&1
        "${_cmd}" 'rm' "${_container_name}" >/dev/null 2>&1
}

build_image() {
        source_in_env

        "${_cmd}" build \
        --force-rm \
        -t "${_tag}" .

        if [ ${?} -ne 0 ] ; then
                errout 'Image build failed'
        fi
}

run_container() {
        kill_previous_container
        source_in_env

        "${_cmd}" run -d \
        --name="${_container_name}" \
        -e PS_COINS="${PS_COINS}" \
        -p 127.0.0.1:8080:8080 \
        "${_tag}"

        if [ ${?} -ne 0 ] ; then
                errout 'Container run failed'
        fi
}

tail_container_logs() {
        printf '\n%s\n%s\n\n' \
        "Logs for container [${_container_name}]" \
        '.......................................'

        "${_cmd}" logs -ft "${_container_name}"

        if [ ${?} -ne 0 ] ; then
                errout 'Problem watching container logs'
        fi
}

print_script_usage_and_exit() {
        local _args='build|reboot|logs|kill'
        local _opt='ps:*'

        printf '%s\n' "USAGE: ${0##*/} ${_args} ['${_opt}']"

        exit 1
}

# -------------------------------------------------------------------------- #
#                       MAIN LOGIC
# -------------------------------------------------------------------------- #

set_docker_cmd

case "${_arg}" in
'build')
        build_image
        ;;
'reboot')
        build_image
        run_container
        tail_container_logs
        ;;
'logs')
        tail_container_logs
        ;;
'kill')
        kill_previous_container
        ;;
*)
        print_script_usage_and_exit
        ;;
esac

exit 0
